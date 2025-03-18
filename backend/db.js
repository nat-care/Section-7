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
function addPurchaseRequest(
    user_id,
    dept, 
    position, 
    subject,  
    list, 
    quantity, 
    counting_unit, 
    unit_price,
    total_amount) {

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
    return newRequest;
}

console.log(loadDatabase());
