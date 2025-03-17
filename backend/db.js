const fs = require('fs');
const DB_FILE = './database.json';

// อ่านข้อมูลจากไฟล์ JSON
function loadDatabase() {
    if (fs.existsSync(DB_FILE)) {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
    return { users: [], purchase_requests: [], quotations: [], vendors: [], purchase_orders: [], po_receipts: [], payments: [], assets: [] };
}

// เขียนข้อมูลลงไฟล์ JSON
function saveDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// **ฟังก์ชันเพิ่มข้อมูลแต่ละประเภท**
// users
function addUser(name, role) { 
    const db = loadDatabase();
    const newUser = { id: Date.now(), name, role };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
}

// purchase_requests ใบขอซื้อ
function addPurchaseRequest(user_id, description, total_amount, desired_date, list, quantity, counting_unit, unit_price, discount, paymentMethod, date_want, dept, position, subject, annotation, Procurement_approver, Purchasing_Officer) {

    const db = loadDatabase();
    const newRequest = {
        id: Date.now(),
        user_id,
        request_date: new Date().toISOString(),
        date_want,              //วันที่ต้องการใช้
        dept,                   //แผนก
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
    db.purchase_requests.push(newRequest);
    saveDatabase(db);
    return newRequest;
}

// vendors
function addVendor(name, contact_name, contact_email, contact_phone) {
    const db = loadDatabase();
    const newVendor = {
        id: Date.now(),
        name,
        contact_name,
        contact_email,
        contact_phone
    };
    db.vendors.push(newVendor);
    saveDatabase(db);
    return newVendor;
}

// quotations
function addQuotation(pr_id, vendor_id, total_price) {
    const db = loadDatabase();
    const newQuotation = {
        id: Date.now(),
        pr_id,
        vendor_id,
        quote_date: new Date().toISOString(),
        total_price,
        status: "Pending"
    };
    db.quotations.push(newQuotation);
    saveDatabase(db);
    return newQuotation;
}

// purchase_orders ใบสั่งซื้อ
function addPurchaseOrder( user_id, description, total_amount, desired_date, list, quantity, counting_unit, unit_price, discount, paymentMethod, authorizedPerson, purchaser, approver ) {
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
    return newOrder;
}

// po_receipts ใบรับพัสดุ
function addPOReceipt(po_id, list, received_by) {
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
    return newReceipt;
}

// payments
function addPayment(po_id, amount) {
    const db = loadDatabase();
    const newPayment = {
        id: Date.now(),
        po_id,
        payment_date: new Date().toISOString(),
        amount,
        status: "Pending"
    };
    db.payments.push(newPayment);
    saveDatabase(db);
    return newPayment;
}

// assets
function addAsset(name, description, cost) {
    const db = loadDatabase();
    const newAsset = {
        id: Date.now(),
        name,
        description,
        purchase_date: new Date().toISOString(),
        cost,
        status: "In Use"
    };
    db.assets.push(newAsset);
    saveDatabase(db);
    return newAsset;
}


console.log(loadDatabase());
