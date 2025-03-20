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
    const { 
        user_id,
        dept, 
        position, 
        subject,  
        list, 
        quantity, 
        counting_unit, 
        unit_price,
        total_amount } = req.body;
    console.log("Received Purchase Request:", req.body);
    if (!user_id || !dept || !position || !subject || !list || !quantity || !counting_unit || !unit_price || !total_amount) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    const db = loadDatabase();
    const newRequest = {
        id: Date.now(),
        user_id,
        dept,                   // แผนก
        position,               // ตำแหน่ง
        subject,                // หัวข้อ,เรื่อง
        list,                   // รายการ
        quantity,               // จำนวน
        counting_unit,          // หน่วยนับ
        unit_price,             // ราคาต่อหน่วย
        total_amount,           // จำนวนเงินรวม
        status: "Pending"       // สถานะเริ่มต้น
    };
    db.purchase_requests.push(newRequest);
    saveDatabase(db);
    res.status(200).json(newRequest);
});

// ส่งข้อมูลไป cardlist
app.get('/database.json', (req, res) => {
    res.sendFile(__dirname + "/database.json");
});

// ส่งข้อมูลไป cardlist ให้ changerole
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    let db = loadDatabase();

    const userIndex = db.users.findIndex(user => user.id == id);
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    db.users[userIndex].role = role;
    saveDatabase(db);
    res.json({ message: "Role updated successfully", user: db.users[userIndex] });
});

// ส่งข้อมูลไป purchase_requests
app.get("/purchase_requests", (req, res) => {
    const db = loadDatabase();
    res.json(db.purchase_requests);
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
