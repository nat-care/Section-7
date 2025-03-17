const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_FILE = './database.json';

app.use(express.json());
app.use(cors());

// โหลดฐานข้อมูล
function loadDatabase() {
    return fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) : { users: [], purchase_requests: [], vendors: [], quotations: [], purchase_orders: [], po_receipts: [], payments: [], assets: [] };
}

// บันทึกฐานข้อมูล
function saveDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ** API สำหรับจัดการผู้ใช้ **

/* GET: ดึงข้อมูลผู้ใช้ทั้งหมด */
app.get('/users', (req, res) => {
    const db = loadDatabase();
    res.json(db.users);
});

/* POST: เพิ่มผู้ใช้ใหม่ */
app.post('/users', (req, res) => {
    const db = loadDatabase();
    const { id, username, password, role } = req.body;
    console.log("Received Data:", req.body); 

    if (!id ||!username || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // ตรวจสอบว่ามี username นี้อยู่แล้วหรือไม่
    if (db.users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const lastUser = db.users.length > 0 ? db.users[db.users.length - 1] : { id: 0 };
    const newId = lastUser.id + 1; // เพิ่มค่า ID อัตโนมัติ

    const newUser = { id: newId, username, password, role };
    db.users.push(newUser);
    saveDatabase(db);
    res.json(newUser);
});

/* POST: Login ด้วย username + password */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = loadDatabase();

    // ค้นหาผู้ใช้จาก username และ password
    const user = db.users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ token: `fake-token-${Date.now()}`, role: user.role });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// purchase_requests ใบขอซื้อ
app.post('/purchase-requests', (req, res) => {
    const { user_id, description, total_amount, desired_date, list, quantity, counting_unit, unit_price, discount, paymentMethod, date_want, dept, position, subject, annotation, Procurement_approver, Purchasing_Officer } = req.body;
    
    // ตรวจสอบข้อมูลที่ได้รับจาก client
    console.log("Received Purchase Request:", req.body);
  
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!user_id || !description || !total_amount || !desired_date || !list || !quantity || !counting_unit || !unit_price || !discount || !paymentMethod || !date_want || !dept || !position || !subject || !annotation || !Procurement_approver || !Purchasing_Officer) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }
   // คำนวณเงินรวมทั้งสิ้น

    const db = loadDatabase();
    const newRequest = {
        id: Date.now(),
        user_id,
        request_date: new Date().toISOString(),
        date_want,              // วันที่ต้องการใช้
        dept,                   // แผนก
        position,               // ตำแหน่ง
        subject,                // เรื่อง
        quantity,               // จำนวน
        counting_unit,          // หน่วยนับ
        unit_price,             // ราคาต่อหน่วย
        total_amount,           // จำนวนเงินรวมที่ผู้ใช้กรอก
        annotation,             // หมายเหตุ
        Procurement_approver,   // ผู้อนุมัติฝ่ายจัดซื้อ
        Purchasing_Officer,     // เจ้าหน้าที่ฝ่ายจัดซื้อ
        status: "Pending"       // สถานะเริ่มต้น
    };
  
    // บันทึกข้อมูลในฐานข้อมูล
    db.purchase_requests.push(newRequest);
    saveDatabase(db);
  
    // ส่งข้อมูลกลับไปให้กับ client
    res.status(200).json(newRequest);
});

// purchase_orders ใบสั่งซื้อ
app.post('/purchase_orders', (req, res) => {
    const { user_id, description, total_amount, desired_date, list, quantity, counting_unit, unit_price, discount, paymentMethod, authorizedPerson, purchaser, approver } = req.body;
    console.log("Received Purchase Request:", req.body);
    
    if (!user_id || !description || !total_amount || !desired_date || !list || !quantity || !counting_unit || !unit_price || !discount || !paymentMethod || !authorizedPerson || !purchaser || !approver) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }
  
    const totalBeforeDiscount = unit_price * quantity;  // คำนวณรวมเงิน
    const discountAmount = totalBeforeDiscount * (discount / 100);  // คำนวณส่วนลด
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;  // คำนวณเงินหลังหักส่วนลด
    const vatAmount = totalAfterDiscount * 0.07;  // คำนวณภาษีมูลค่าเพิ่ม (สมมติภาษี 7%)
    const totalWithVAT = totalAfterDiscount + vatAmount;  // คำนวณเงินรวมทั้งสิ้น

    const db = loadDatabase();
    const newOrder = {
        id: Date.now(),
        user_id,
        request_date: new Date().toISOString(),
        distributor: user_id,  // ผู้ใช้งานที่เป็น distributor
        desired_date,          // วันที่ที่ผู้ใช้กรอก
        list,                  // รายการที่ต้องการ
        quantity,              // จำนวน
        counting_unit,         // หน่วยนับ
        unit_price,            // ราคาต่อหน่วย
        discount,              // ส่วนลด
        total_amount,          // จำนวนเงินรวมที่ผู้ใช้กรอก
        totalBeforeDiscount,   // รวมเงินก่อนหักส่วนลด
        discountAmount,        // ส่วนลด
        totalAfterDiscount,    // เงินหลังหักส่วนลด
        vatAmount,             // จำนวนภาษีมูลค่าเพิ่ม
        totalWithVAT,          // เงินรวมทั้งสิ้น
        paymentMethod,         // บันทึกวิธีการชำระเงิน
        authorizedPerson,      // เก็บข้อมูลผู้มีอำนาจ
        purchaser,             // เก็บข้อมูลผู้จัดซื้อ
        approver,              // เก็บข้อมูลผู้ตรวจสอบ
    };
  
    db.purchase_orders.push(newOrder);
    saveDatabase(db);
    res.status(200).json(newOrder);
});

// po_receipts ใบรับพัสดุ
app.post('/po_receipts', (req, res) => {
    const { po_id, list, received_by } = req.body;
    console.log("Received Purchase Request:", req.body);
    if ( !po_id || !list || !received_by ) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }
  
    const db = loadDatabase();
    const newReceipt = {
        id: Date.now(),
        po_id,
        received_date: new Date().toISOString(),
        list,
        received_by,
        status: "Pending"
    };

    db.po_receipts.push(newReceipt);
    saveDatabase(db);
  
    res.status(200).json(newReceipt);
});
  

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
