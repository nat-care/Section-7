const express = require("express");
const fs = require("fs");
const cors = require("cors");
const db = require('./db');

const app = express();
const PORT = 3000;
const DB_FILE = "./database.json";

app.use(express.json());
app.use(cors());

// โหลดฐานข้อมูล
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      users: [],
      purchase_requests: [],
      quotations: [],
      products: [],
      stock_locations: [],
      purchase_requisitions: [],
      shipping_notes: [],
      requisitions: [],
      invoices: [],
      purchase_orders: [],
    };
    saveDatabase(initialDB);
    return initialDB;
  }

  const raw = fs.readFileSync(DB_FILE, "utf-8");
  const db = JSON.parse(raw);
  // 🛡️ Ensure all expected properties exist
  if (!db.users) db.users = [];
  if (!db.purchase_requests) db.purchase_requests = [];
  if (!db.quotations) db.quotations = [];
  if (!db.products) db.products = [];
  if (!db.stock_locations) db.stock_locations = [];
  if (!db.purchase_requisitions) db.purchase_requisitions = [];
  if (!db.shipping_notes) db.shipping_notes = [];
  if (!db.requisitions) db.requisitions = [];
  if (!db.invoices) db.invoices = [];
  if (!db.purchase_orders) db.purchase_orders = [];

  return db;
}

// บันทึกฐานข้อมูล
function saveDatabase(data) {
  console.log("Saving DB...");
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}


// ** API สำหรับจัดการผู้ใช้ **

/* GET: ดึงข้อมูลผู้ใช้ทั้งหมด */
app.get("/users", (req, res) => {
  const db = loadDatabase();
  res.json(db.users);
});

/* POST: เพิ่มผู้ใช้ใหม่ */
app.post("/users", (req, res) => {
  const { username, password, role } = req.body;
  console.log("Received Data:", req.body);

  const db = loadDatabase(); // ✅ เพิ่มบรรทัดนี้

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (db.users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const lastUser = db.users.length > 0 ? db.users[db.users.length - 1] : { id: 0 };
  const newId = lastUser.id + 1;

  const newUser = { id: newId, username, password, role };
  db.users.push(newUser);
  saveDatabase(db);

  console.log("✅ New user created:", newUser);
  res.json(newUser);
});

/* DELETE: ลบผู้ใช้ตาม ID */
app.delete("/users/:id", (req, res) => {
  const db = loadDatabase();
  const userId = parseInt(req.params.id);

  const index = db.users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = db.users.splice(index, 1)[0];
  saveDatabase(db);

  res.json({ message: "User deleted", deletedUser });
});

// PUT: อัปเดต role ของผู้ใช้ตาม ID
app.put("/users/:id", (req, res) => {
  const db = loadDatabase();
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  const userIndex = db.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  db.users[userIndex].role = role;
  saveDatabase(db);

  res.json({ message: "User role updated", user: db.users[userIndex] });
});

/* POST: Login ด้วย username + password */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = loadDatabase();

  // ค้นหาผู้ใช้
  const user = db.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = `fake-token-${Date.now()}`;
    res.json({
      token,
      role: user.role,
      id: user.id,
      fullname: user.fullname || user.username,
      position: user.position || user.role,
      department: user.department || "ไม่ระบุ",
      username: user.username
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});


// GET: ดึงข้อมูล purchase_requests
app.get("/purchase-requests", (req, res) => {
  const db = loadDatabase();
  res.json(db.purchase_requests || []);
});

// ** API สำหรับ Purchase Requisition (PR) **

app.post("/purchase-requests", (req, res) => {
  const {
    name, // 👈 รับจาก frontend แทน idPR เดิม
    date,
    employeeName,
    employeePosition,
    department,
    section,
    detail,
    remark,
    approver,
    staff,
    dateApproval,
    dateApproval2,
    products,
  } = req.body;
  
  console.log("Received Purchase Request:", req.body);
  
  if (
    !name ||
    !date ||
    !employeeName ||
    !employeePosition ||
    !department ||
    !section ||
    !detail ||
    !products
  ) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }
  
  const db = loadDatabase();
  
  const newRequest = {
    id: Date.now().toString(), // generate ID ฝั่ง backend
    name,                      // ใช้รหัส PR ที่กรอกจาก frontend
    date,
    employeeName,
    employeePosition,
    department,
    section,
    detail,
    remark,
    approver,
    staff,
    dateApproval,
    dateApproval2,
    products,
    status: "Pending",
  };
  
  db.purchase_requests.push(newRequest);
  saveDatabase(db);
  
  res.status(200).json(newRequest);
  
});

// ** API สำหรับ Delivery Receipt (DR) **

app.post("/delivery-receipts", (req, res) => {
  const {
    idDR,
    drNo, // DR No.
    dateDR, // Date
    employeePosition, // Employee Position
    EmployeeID,
    department, // Department
    products, // Array of product objects
    goodsDetails, // ตามสินค้า
    dueDate, // วันที่ครบกำหนด
    deliveryDate, // วันที่ส่งมอบสินค้า
    checkGoodsDetail, // ตรวจรับสินค้าตาม
    receiveGoodsDate, // ได้รับสินค้า
    additionalDetails, // เรื่องรายละเอียด
    remarks, // หมายเหตุ
    sender,   // ผู้ส่งพัสดุ
    receiver, //  ผู้รับพัสดุ
    approvalDate, // วันที่อนุมัติ
    approvalDate2, // วันที่อนุมัติ (ผู้รับพัสดุ)
  } = req.body;

  // Validate required fields
  if (
    !idDR ||
    !drNo ||
    !dateDR ||
    !employeePosition ||
    !department ||
    !EmployeeID ||
    !products
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate that products array is not empty
  if (!products || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide at least one product" });
  }

  // Validate individual product fields
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (
      !product.item ||
      !product.quantity ||
      !product.unit ||
      !product.unitPrice
    ) {
      return res
        .status(400)
        .json({ message: `Missing product details for item #${i + 1}` });
    }
  }

  const db = loadDatabase();

  // Create a new Delivery Receipt entry
  const newDR = {
    id: Date.now(),
    idDR,
    drNo, // DR No.
    dateDR, // Date
    employeePosition, // Employee Position
    EmployeeID,
    department, // Department
    products, // Array of product objects
    goodsDetails, // ตามสินค้า
    dueDate, // วันที่ครบกำหนด
    deliveryDate, // วันที่ส่งมอบสินค้า
    checkGoodsDetail, // ตรวจรับสินค้าตาม
    receiveGoodsDate, // ได้รับสินค้า
    additionalDetails, // เรื่องรายละเอียด
    remarks, // หมายเหตุ
    sender,   // ผู้ส่งพัสดุ
    receiver, //  ผู้รับพัสดุ
    approvalDate, // วันที่อนุมัติ
    approvalDate2, // วันที่อนุมัติ (ผู้รับพัสดุ)
    status: "Pending", // Default status
  };

  db.delivery_receipts.push(newDR);
  saveDatabase(db);

  res.status(200).json(newDR); // Return the new delivery receipt data
});

// GET: Retrieve all Delivery Receipts (DR)
app.get("/delivery-receipts", (req, res) => {
  const db = loadDatabase();
  res.json(db.delivery_receipts); // Return all delivery receipts
});

// ** API สำหรับ Shipping Notes **

app.post("/shipping-notes", (req, res) => {
  const {
    idSN,
    dateSN,
    employeeName,
    employeePosition,
    senderName,
    detail,
    products,
    totalAmount,
    notes,
    sender,
    reciver,
    dateApproval,
    dateApproval2,
    parcelNumber,
    transportCompany,
    comments,
  } = req.body;

  // Validate required fields
  if (
    !idSN ||
    !dateSN ||
    !employeeName ||
    !senderName ||
    !products ||
    products.length === 0
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate product details
  const invalidProduct = products.find(
    (product) =>
      !product.item || !product.quantity || !product.unit || !product.unitPrice
  );
  if (invalidProduct) {
    return res.status(400).json({ message: "Invalid product details" });
  }

  const db = loadDatabase();
  const newSN = {
    id: Date.now(),
    idSN,
    dateSN,
    employeeName,
    employeePosition,
    senderName,
    detail,
    products,
    totalAmount,
    notes,
    sender,
    reciver,
    dateApproval,
    dateApproval2,
    parcelNumber,
    comments,
    transportCompany,
    status: "Shipped",
  };

  db.shipping_notes.push(newSN);
  saveDatabase(db);
  res.status(200).json(newSN);
});

// GET: Retrieve all Shipping Notes
app.get("/shipping-notes", (req, res) => {
  const db = loadDatabase();
  res.json(db.shipping_notes);
});

// ** API สำหรับ Requisition Forms **

// POST: Create a new Requisition Form
app.post("/requisitions", (req, res) => {
  const {
    idRF,
    dateRF,
    employeeName,
    employeeId,
    senderName,
    detail,
    products,
    totalAmount,
    notes,
    approver,
    approverStaff,
    inventoryStaff,
    dateApproval,
    dateApproval2,
    dateApproval3,
  } = req.body;

  // Validate required fields
  if (
    !idRF ||
    !dateRF ||
    !employeeName ||
    !employeeId ||
    !products ||
    products.length === 0
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = loadDatabase();

  // Create a new requisition form object
  const newRF = {
    id: Date.now(),
    idRF,
    dateRF,
    employeeName,
    employeeId,
    senderName,
    detail,
    products,
    totalAmount,
    notes,
    approver,
    approverStaff,
    inventoryStaff,
    dateApproval,
    dateApproval2,
    dateApproval3,
    status: "Pending",
  };

  // Save the new form to the database
  db.requisitions.push(newRF);
  saveDatabase(db);

  // Return the created requisition form as a response
  res.status(200).json(newRF);
});

// GET: Retrieve all Requisition Forms
app.get("/requisitions", (req, res) => {
  const db = loadDatabase();
  res.json(db.requisitions);
});

// ** API สำหรับ Invoices **

// POST: Create a new Invoice
app.post("/invoices", (req, res) => {
  console.log("Received request body:", req.body);
  const {
    idIV,
    companyThatMustPay,
    detail,
    products,
    totalAmount,
    discount,
    vat,
    netAmount,
    payment,
    notes,
    companyName,
    companyAddress,
    companyAddress2,
    taxID,
    email1,
    email2,
    penalty,
    approver,
    staff,
    dateApproval,
    dateApproval2,
  } = req.body;

  // Check for required fields
  if (!idIV || !companyThatMustPay || !totalAmount || !payment) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = loadDatabase();
  const newInvoice = {
    id: Date.now(),
    idIV,
    companyThatMustPay,
    detail,
    products,
    totalAmount,
    discount,
    vat,
    netAmount,
    payment,
    notes,
    companyName,
    companyAddress,
    companyAddress2,
    taxID,
    email1,
    email2,
    penalty,
    approver,
    staff,
    dateApproval,
    dateApproval2,
    status: "Pending", // Default status is "Pending"
  };

  db.invoices.push(newInvoice);
  saveDatabase(db);

  // Respond with the newly created invoice
  res.status(201).json(newInvoice); // 201 for successful creation
});

// GET: Retrieve all Invoices
app.get("/invoices", (req, res) => {
  const db = loadDatabase();

  // If no invoices are found
  if (!db.invoices || db.invoices.length === 0) {
    return res.status(404).json({ message: "No invoices found" });
  }

  res.json(db.invoices);
});

// GET: Retrieve latest invoice
app.get("/invoices/latest", (req, res) => {
  const db = loadDatabase();
  const invoices = db.invoices;

  if (!invoices || invoices.length === 0) {
    return res.status(404).json({ message: "No invoices found" });
  }

  const latestInvoice = invoices[invoices.length - 1];
  res.json(latestInvoice);
});

// ** API สำหรับ Purchase Orders (PO) **

app.post("/purchase-orders", (req, res) => {
  const {
    name,
    date,
    employeeName,
    employeePosition,
    department,
    section,
    detail,
    approver,
    purchaser,
    auditor,
    dateApproval,
    dateApproval2,
    dateApproval3,
    products,
    totalAmount,
    discount,
    vat,
    netAmount,
    payment,
    notes,
  } = req.body;

  // ✅ โหลด database ก่อนใช้งาน
  const db = loadDatabase();

  if (
    !name || !date || !employeeName || !employeePosition ||
    !department || !section || !detail || !products
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newPO = {
    id: Date.now(),
    name,
    date,
    employeeName,
    employeePosition,
    department,
    section,
    detail,
    approver,
    purchaser,
    auditor,
    dateApproval,
    dateApproval2,
    dateApproval3,
    products,
    totalAmount,
    discount,
    vat,
    netAmount,
    payment,
    notes,
    status: "Pending",
  };

  db.purchase_orders.push(newPO); // ✅ ไม่ error เพราะโหลด db แล้ว
  saveDatabase(db);
  res.status(200).json(newPO);
});


// GET: Retrieve all Purchase Orders (PO)
app.get("/purchase-orders", (req, res) => {
  const db = loadDatabase();
  res.json(db.purchase_orders);
});

// PATCH: อัปเดตยอดค้างชำระของ Invoice
// PATCH: อัปเดตยอดค้างชำระของ Invoice โดยใช้ idIV
app.patch("/invoices/:idIV", (req, res) => {
  const { paymentAmount } = req.body;

  if (!paymentAmount) {
    return res.status(400).json({ message: "Missing payment amount" });
  }

  const db = loadDatabase();
  const idIVParam = req.params.idIV.trim(); // ลบช่องว่างจาก URL
  // เพิ่ม console.log เพื่อตรวจสอบค่า
  console.log("idIVParam:", idIVParam);
  console.log("Invoice IDs in DB:", db.invoices.map(inv => inv.idIV.trim()));

  // ค้นหา index ของ invoice โดยใช้ idIV ที่ถูก trim
  const invoiceIndex = db.invoices.findIndex(
    inv => inv.idIV.trim() === idIVParam
  );
  if (invoiceIndex === -1) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const invoice = db.invoices[invoiceIndex];
  const currentOutstanding = parseFloat(invoice.totalAmount);
  const payment = parseFloat(paymentAmount);

  if (isNaN(payment) || payment <= 0) {
    return res.status(400).json({ message: "Invalid payment amount" });
  }
  if (payment > currentOutstanding) {
    return res.status(400).json({ message: "Payment amount exceeds outstanding balance" });
  }

  const newOutstanding = currentOutstanding - payment;

  if (newOutstanding === 0) {
    // ถ้ายอดคงเหลือเป็น 0 ให้ลบใบแจ้งหนี้ออกจากฐานข้อมูล
    db.invoices.splice(invoiceIndex, 1);
    saveDatabase(db);
    return res.json({ message: "Invoice fully paid and deleted" });
  } else {
    // อัปเดตยอดค้างชำระในใบแจ้งหนี้
    invoice.totalAmount = newOutstanding.toString();
    saveDatabase(db);
    return res.json(invoice);
  }
});

app.get("/products", (req, res) => {
  const db = loadDatabase();
  res.json(db.products); // ส่งข้อมูลสินค้าทั้งหมด
});


app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;  // ดึง ID ของสินค้า จาก URL
  const db = loadDatabase();  // โหลดข้อมูลฐานข้อมูล
  const product = db.products.find((p) => p.product_id == productId);  // ค้นหาสินค้าตาม ID

  if (product) {
    res.json(product);  // ถ้าพบสินค้า ส่งข้อมูลสินค้ากลับมา
  } else {
    res.status(404).json({ error: 'Product not found' });  // ถ้าไม่พบสินค้า ส่งข้อความผิดพลาด 404
  }
});

// ใน backend API (Node.js example)
app.post("/documents/approve", (req, res) => {
  const { documentId, status } = req.body;
  // ค้นหาเอกสารในฐานข้อมูลแล้วอัปเดตสถานะ
  // ส่งคำตอบกลับเมื่ออัปเดตสำเร็จ
});


// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
