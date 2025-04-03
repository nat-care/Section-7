const fs = require("fs");
const DB_FILE = "./database.json";

// อ่านข้อมูลจากไฟล์ JSON
function loadDatabase() {
    if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
        return {
            users: data.users || [],
            purchase_requests: data.purchase_requests || [],
            quotations: data.quotations || [],
            products: data.products || [],
            stock_locations: data.stock_locations || []
        };
    }
    // ถ้ายังไม่มีไฟล์
    return {
        users: [],
        purchase_requests: [],
        quotations: [],
        products: [],
        stock_locations: []
    };
}

// เขียนข้อมูลกลับลงไฟล์ JSON
function saveDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// เพิ่มผู้ใช้ใหม่
function addUser(username, password, fullname, department, position, role) {
    const db = loadDatabase();
    const newUser = {
        id: Date.now(),
        username,
        password,   // เพิ่มรหัสผ่าน
        fullname,   // เพิ่มชื่อเต็ม
        department, // เพิ่มแผนก
        position,   // เพิ่มตำแหน่ง
        role
    };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
}


// เพิ่มใบขอซื้อ (PR) แบบมี products array
function addPurchaseRequest(prData) {
    const db = loadDatabase();
    const newRequest = {
        id: Date.now(),
        ...prData
    };
    db.purchase_requests.push(newRequest);
    saveDatabase(db);
    return newRequest;
}

// เพิ่มสินค้าใหม่
function addProduct(name, description, price, stock_quantity) {
    const db = loadDatabase();
    const newProduct = {
        product_id: Date.now(),
        name,
        description,
        price,
        stock_quantity,
        remaining_stock: stock_quantity
    };
    db.products.push(newProduct);
    saveDatabase(db);
    return newProduct;
}

// เพิ่มตำแหน่งเก็บสินค้า (stock location)
function addStockLocation(product_id, warehouse_id, quantity) {
    const db = loadDatabase();
    const newStock = {
        stock_id: Date.now(),
        product_id,
        warehouse_id,
        quantity
    };
    db.stock_locations.push(newStock);

    updateRemainingStock(db, product_id); // อัปเดตคงเหลือ
    saveDatabase(db);
    return newStock;
}

// อัปเดตคงเหลือสินค้า
function updateRemainingStock(db, product_id) {
    let remaining = 0;
    db.stock_locations.forEach(stock => {
        if (stock.product_id === product_id) {
            remaining += stock.quantity;
        }
    });
    const product = db.products.find(p => p.product_id === product_id);
    if (product) {
        product.remaining_stock = remaining;
    }
}

// ส่งออกให้ใช้งานภายนอก
module.exports = {
    loadDatabase,
    saveDatabase,
    addUser,
    addPurchaseRequest,
    addProduct,
    addStockLocation
};
