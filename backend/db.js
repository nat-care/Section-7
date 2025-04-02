const fs = require('fs');
const DB_FILE = './database.json';

// อ่านข้อมูลจากไฟล์ JSON
function loadDatabase() {
    if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        console.log("โหลดฐานข้อมูล:", data);  // เพิ่ม log ที่นี่
        return data;
    }
    console.log("ฐานข้อมูลใหม่ที่สร้างขึ้น");
    return { 
        users: [], 
        purchase_requests: [], 
        quotations: [], 
        products: [], 
        stock_locations: [] 
    };
}

// เขียนข้อมูลลงไฟล์ JSON
function saveDatabase(data) {
    console.log("บันทึกข้อมูล:", data);
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

// **ฟังก์ชันเพิ่มสินค้า (addProduct)**
// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่
function addProduct(name, description, price, stock_quantity) {
    const db = loadDatabase();
    const newProduct = {
        product_id: Date.now(),
        name,
        description,
        price,
        stock_quantity,
        remaining_stock: stock_quantity // สินค้าคงเหลือเริ่มต้นเท่ากับ stock_quantity
    };
    console.log("เพิ่มสินค้า:", newProduct);
    db.products.push(newProduct);
    saveDatabase(db);
    return newProduct;
}

// **ฟังก์ชันเพิ่มตำแหน่งสินค้าในคลัง (addStockLocation)**
// ฟังก์ชันสำหรับเพิ่มข้อมูลตำแหน่งคลังสินค้า
function addStockLocation(product_id, warehouse_id, quantity) {
    const db = loadDatabase();
    const newStockLocation = {
        stock_id: Date.now(),
        product_id,
        warehouse_id,
        quantity
    };
    console.log("เพิ่มตำแหน่งสินค้าในคลัง:", newStockLocation);
    db.stock_locations.push(newStockLocation);

    // อัปเดตสินค้าคงเหลือ โดยส่ง db เข้าไป
    updateRemainingStock(db, product_id);

    saveDatabase(db); // บันทึกข้อมูลหลังจากอัปเดต remaining_stock แล้ว
    return newStockLocation;
}

// **ฟังก์ชันคำนวณสินค้าคงเหลือ (updateRemainingStock)**
// ฟังก์ชันคำนวณสินค้าคงเหลือของสินค้า
function updateRemainingStock(db, product_id) {
    let remainingStock = 0;

    // คำนวณสินค้าคงเหลือจาก stock_locations
    db.stock_locations.forEach(stock => {
        if (stock.product_id === product_id) {
            remainingStock += stock.quantity;
        }
    });

    // อัปเดต remaining_stock ใน products
    const product = db.products.find(p => p.product_id === product_id);
    if (product) {
        product.remaining_stock = remainingStock;
    }
}

// **ทดสอบการใช้งาน**
// เพิ่มสินค้า
const newProduct = addProduct("คอมพิวเตอร์", "3800RAM", 5000, 100);
console.log("เพิ่มสินค้าใหม่:", newProduct);

const newStockLocation1 = addStockLocation(newProduct.product_id, 1, 50);
console.log("เพิ่มสินค้าที่คลัง 1:", newStockLocation1);
const newStockLocation2 = addStockLocation(newProduct.product_id, 2, 30);
console.log("เพิ่มสินค้าที่คลัง 2:", newStockLocation2);
console.log("ฐานข้อมูลที่อัปเดต:", loadDatabase());

