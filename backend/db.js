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

// purchase_requests
function addPurchaseRequest(user_id, description, total_amount) {
    const db = loadDatabase();
    const newRequest = {
        id: Date.now(),
        user_id,
        request_date: new Date().toISOString(),
        description,
        total_amount,
        status: "Pending"
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

// purchase_orders
function addPurchaseOrder(pr_id, vendor_id, total_amount) {
    const db = loadDatabase();
    const newOrder = {
        id: Date.now(),
        pr_id,
        vendor_id,
        order_date: new Date().toISOString(),
        total_amount,
        status: "Pending"
    };
    db.purchase_orders.push(newOrder);
    saveDatabase(db);
    return newOrder;
}

// po_receipts
function addPOReceipt(po_id, received_by) {
    const db = loadDatabase();
    const newReceipt = {
        id: Date.now(),
        po_id,
        received_date: new Date().toISOString(),
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
