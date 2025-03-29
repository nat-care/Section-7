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
    return fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) : { 
        users: [], 
        purchase_requests: [], 
        quotations: [], 
        products: [], //รายการสินค้า
        stock_locations: [], //คลังสินค้า
        purchase_requisitions: [], // Added
        shipping_notes: [], // Added
        requisition_forms: [], // Added
        invoices: [] // Added
    };
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

// GET: ดึงข้อมูล purchase_requests
app.get('/purchase_requests', (req, res) => {
    const db = loadDatabase();
    res.json(db.purchase_requests || []);
});

// ** API สำหรับ Purchase Requisition (PR) **

app.post('/purchase-requisitions', (req, res) => {
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
        dept,                   
        position,               
        subject,                
        list,                   
        quantity,               
        counting_unit,          
        unit_price,             
        total_amount,           
        status: "Pending"       
    };
    db.purchase_requisitions.push(newRequest);
    saveDatabase(db);
    res.status(200).json(newRequest);
});

// GET: Retrieve all Purchase Requisitions (PR)
app.get('/purchase-requisitions', (req, res) => {
    const db = loadDatabase();
    res.json(db.purchase_requisitions);
});

// ** API สำหรับ Delivery Receipt (DR) **

app.post('/delivery-receipts', (req, res) => {
    const { 
        user_id, 
        po_id, 
        date, 
        items, 
        received_by 
    } = req.body;

    if (!user_id || !po_id || !date || !items || !received_by) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = loadDatabase();
    const newDR = {
        id: Date.now(),
        user_id,
        po_id,
        date,
        items,
        received_by,
        status: "Pending"
    };
    db.po_receipts.push(newDR);
    saveDatabase(db);
    res.status(200).json(newDR);
});

// GET: Retrieve all Delivery Receipts (DR)
app.get('/delivery-receipts', (req, res) => {
    const db = loadDatabase();
    res.json(db.po_receipts);
});

// ** API สำหรับ Shipping Notes **

app.post('/shipping-notes', (req, res) => {
    const { 
        user_id, 
        po_id, 
        shipping_date, 
        shipping_company, 
        tracking_number, 
        items 
    } = req.body;

    if (!user_id || !po_id || !shipping_date || !shipping_company || !tracking_number || !items) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = loadDatabase();
    const newSN = {
        id: Date.now(),
        user_id,
        po_id,
        shipping_date,
        shipping_company,
        tracking_number,
        items,
        status: "Shipped"
    };
    db.shipping_notes.push(newSN);
    saveDatabase(db);
    res.status(200).json(newSN);
});

// GET: Retrieve all Shipping Notes
app.get('/shipping-notes', (req, res) => {
    const db = loadDatabase();
    res.json(db.shipping_notes);
});

// ** API สำหรับ Requisition Forms **

app.post('/requisition-forms', (req, res) => {
    const { 
        user_id, 
        dept, 
        items, 
        requested_by, 
        reason 
    } = req.body;

    if (!user_id || !dept || !items || !requested_by || !reason) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = loadDatabase();
    const newRF = {
        id: Date.now(),
        user_id,
        dept,
        items,
        requested_by,
        reason,
        status: "Pending"
    };
    db.requisition_forms.push(newRF);
    saveDatabase(db);
    res.status(200).json(newRF);
});

// GET: Retrieve all Requisition Forms
app.get('/requisition-forms', (req, res) => {
    const db = loadDatabase();
    res.json(db.requisition_forms);
});

// ** API สำหรับ Invoices **

app.post('/invoices', (req, res) => {
    const { 
        po_id, 
        invoice_number, 
        date, 
        total_amount, 
        payment_status, 
        notes 
    } = req.body;

    if (!po_id || !invoice_number || !date || !total_amount || !payment_status) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = loadDatabase();
    const newInvoice = {
        id: Date.now(),
        po_id,
        invoice_number,
        date,
        total_amount,
        payment_status,
        notes,
        status: "Pending"
    };
    db.invoices.push(newInvoice);
    saveDatabase(db);
    res.status(200).json(newInvoice);
});

// GET: Retrieve all Invoices
app.get('/invoices', (req, res) => {
    const db = loadDatabase();
    res.json(db.invoices);
});

// ** API สำหรับ Purchase Orders (PO) **

app.post('/purchase-orders', (req, res) => {
    const {
        idPO,
        datePO,
        employeeName,
        employeePosition,
        department,
        section,
        detail,
        products,
        totalAmount,
        discount,
        vat,
        netAmount,
        payment,
        notes,
        approver,
        dateApprover,
        staff,
        dateStaff,
        auditor,
        dateAuditor
    } = req.body;
    console.log("Received Purchase Order:", req.body);

    if (!idPO || !datePO || !employeeName || !employeePosition || !department || !section || !detail || !products || !totalAmount || !discount || !vat || !netAmount || !payment) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const db = loadDatabase();
    const newPO = {
        id: Date.now(),
        idPO,
        datePO,
        employeeName,
        employeePosition,
        department,
        section,
        detail,
        products,
        totalAmount,
        discount,
        vat,
        netAmount,
        payment,
        notes,
        approver,
        dateApprover,
        staff,
        dateStaff,
        auditor,
        dateAuditor,
        status: "Pending"
    };
    db.purchase_orders.push(newPO);
    saveDatabase(db);
    res.status(200).json(newPO);
});

// GET: Retrieve all Purchase Orders (PO)
app.get('/purchase-orders', (req, res) => {
    const db = loadDatabase();
    res.json(db.purchase_orders);
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
