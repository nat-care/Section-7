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
  return fs.existsSync(DB_FILE)
    ? JSON.parse(fs.readFileSync(DB_FILE, "utf-8"))
    : {
        users: [],
        purchase_requests: [],
        quotations: [],
        products: [], //รายการสินค้า
        stock_locations: [], //คลังสินค้า
        purchase_requisitions: [], // Added
        shipping_notes: [], // Added
        requisitions: [], // Added
        invoices: [], // Added
        purchase_orders: [], // Added missing purchase_orders
      };
}

// บันทึกฐานข้อมูล
function saveDatabase(data) {
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
  const { id, username, password, role } = req.body;
  console.log("Received Data:", req.body);

  if (!id || !username || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // ตรวจสอบว่ามี username นี้อยู่แล้วหรือไม่
  if (db.users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const lastUser =
    db.users.length > 0 ? db.users[db.users.length - 1] : { id: 0 };
  const newId = lastUser.id + 1; // เพิ่มค่า ID อัตโนมัติ

  const newUser = { id: newId, username, password, role };
  db.users.push(newUser);
  saveDatabase(db);
  res.json(newUser);
});

/* POST: Login ด้วย username + password */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = loadDatabase();

  // ค้นหาผู้ใช้จาก username และ password
  const user = db.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ token: `fake-token-${Date.now()}`, role: user.role });
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
    idPR,
    datePR,
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
    !idPR ||
    !datePR ||
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
    id: Date.now(),
    idPR,
    datePR,
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

// ** API สำหรับ Purchase Orders (PO) **

app.post("/purchase-orders", (req, res) => {
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
    dateAuditor,
  } = req.body;
  console.log("Received Purchase Order:", req.body);

  if (
    !idPO ||
    !datePO ||
    !employeeName ||
    !employeePosition ||
    !department ||
    !section ||
    !detail ||
    !products ||
    !totalAmount ||
    !discount ||
    !vat ||
    !netAmount ||
    !payment
  ) {
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
    status: "Pending",
  };
  db.purchase_orders.push(newPO);
  saveDatabase(db);
  res.status(200).json(newPO);
});

// GET: Retrieve all Purchase Orders (PO)
app.get("/purchase-orders", (req, res) => {
  const db = loadDatabase();
  res.json(db.purchase_orders);
});

app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  const product = await db.getProductById(productId);
  if (product) {
      res.json(product);
  } else {
      res.status(404).json({ error: 'Product not found' });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
