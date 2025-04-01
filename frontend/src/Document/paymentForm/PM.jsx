import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./PM.css";

function PM() {
  const navigate = useNavigate(); 

  const [idIV, setIdIV] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

  // ฟิลด์ที่เกี่ยวข้องกับการชำระเงิน
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payerName, setPayerName] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // เพิ่ม state สำหรับโอนเงินจาก และ โอนไปยัง (UI เท่านั้น)
  const [fromBank, setFromBank] = useState("");
  const [toBank, setToBank] = useState("");

  // รายการธนาคาร (ตัวอย่าง)
  const bankOptions = [
    "ธนาคารกสิกรไทย",
    "ธนาคารไทยพาณิชย์",
    "ธนาคารกรุงเทพ",
    "ธนาคารกรุงศรีอยุธยา",
    "ธนาคารทหารไทยธนชาต (ttb)",
    "ธนาคารยูโอบี",
  ];

  // สร้าง state สำหรับควบคุมว่าจะให้แสดงหน้า Success หรือไม่
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  // ฟังก์ชันค้นหาใบสั่งซื้อจาก idIV
  const handleSearch = async () => {
    try {
      const response = await fetch("http://localhost:3000/invoices");
      const data = await response.json();
      // ค้นหา invoice ที่มี idIV ตรงกับที่กรอก (trim ป้องกันช่องว่าง)
      const foundInvoice = data.find((inv) => inv.idIV.trim() === idIV.trim());

      if (foundInvoice) {
        setInvoiceData(foundInvoice);
      } else {
        setInvoiceData(null);
        alert("ไม่พบหมายเลขคำสั่งซื้อที่ระบุ");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  // ฟังก์ชันบันทึกการชำระเงินและอัปเดตยอดค้างในดาต้าเบส
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invoiceData) {
      alert("กรุณาตรวจสอบหมายเลขคำสั่งซื้อก่อน");
      return;
    }
    const outstanding = parseFloat(invoiceData.totalAmount);
    const payment = parseFloat(paymentAmount);

    if (isNaN(payment) || payment <= 0) {
      alert("กรุณากรอกจำนวนเงินที่ชำระให้ถูกต้อง");
      return;
    }
    if (payment > outstanding) {
      alert("จำนวนเงินที่ชำระเกินยอดค้างชำระ");
      return;
    }

    // เรียก PATCH เพื่ออัปเดตใบแจ้งหนี้
    fetch(`http://localhost:3000/invoices/${invoiceData.idIV.trim()}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentAmount: paymentAmount }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update invoice");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated invoice:", data);
        if (data.message && data.message === "Invoice fully paid and deleted") {
          setInvoiceData(null);
          alert("ใบแจ้งหนี้ถูกลบ เนื่องจากยอดคงเหลือเป็น 0");
        } else {
          setInvoiceData(data);
          alert("บันทึกข้อมูลการชำระเงินและอัปเดตยอดค้างเรียบร้อยแล้ว");
        }
        // เมื่อสำเร็จ ให้แสดงหน้า Success
        setShowSuccessPage(true);
      })
      .catch((error) => {
        console.error("Error updating invoice:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตยอดค้างชำระ");
      });

    // ตัวอย่างข้อมูลการชำระเงิน (ไม่ได้ส่งไป backend)
    const paymentInfo = {
      idIV,
      originalOutstanding: outstanding,
      paymentDate,
      paymentAmount: payment,
      payerName,
      remark,
      file: selectedFile,
      fromBank,
      toBank,
    };
    console.log("ข้อมูลการชำระเงิน:", paymentInfo);
  };

  // ถ้า showSuccessPage เป็น true -> แสดงหน้า "อัปโหลดหลักฐานการชำระเงินเรียบร้อยแล้ว"
  if (showSuccessPage) {
    return (
      <div className="pm-success-container">
        <div className="pm-success-icon">✔</div>
        <h2>อัปโหลดหลักฐานการชำระเงินเรียบร้อยแล้ว</h2>
        {/** แสดงหมายเลขคำสั่งซื้อ */}
        <p>หมายเลขคำสั่งซื้อ: {idIV}</p>
        <p>ขอบคุณที่ใช้บริการ</p>
        <div className="pm-button-group-success">
          <button className="pm-success-button"
            onClick={() => {
              // ถ้าต้องการกลับสู่หน้าแรกหรือหน้าอื่น ๆ 
              // อาจใช้ react-router หรือรีเซ็ต state ก็ได้
              setShowSuccessPage(false);
              navigate("/selectpages");
            }}
          >
            กลับสู่หน้าแรก
          </button>
          <button className="pm-success-button"
            onClick={() => {
              
              
              navigate("/form/payment-list");
            }}
          >
            ตรวจสอบสถานะ
          </button>
        </div>
      </div>
    );
  }

  // ถ้า showSuccessPage เป็น false -> แสดงฟอร์มปกติ
  return (
    <div className="pm-container">
      <h1>ชำระเงิน (Payment Management)</h1>
      <form onSubmit={handleSubmit} className="pm-form">
        {/* หมายเลขคำสั่งซื้อ */}
        <div className="pm-form-group">
          <label htmlFor="idIV">หมายเลขคำสั่งซื้อ (idIV)</label>
          <div className="pm-search-area">
            <input
              type="text"
              id="idIV"
              value={idIV}
              onChange={(e) => setIdIV(e.target.value)}
              placeholder="กรอกหมายเลขคำสั่งซื้อ"
            />
            <button
              type="button"
              className="pm-search-button"
              onClick={handleSearch}
            >
              ตรวจสอบ
            </button>
          </div>
        </div>

        {/* แสดงยอดค้างชำระเมื่อเจอ invoice */}
        {invoiceData && (
          <div className="pm-form-group">
            <label>ยอดค้างชำระ</label>
            <div className="pm-total-amount">{invoiceData.totalAmount} บาท</div>
          </div>
        )}

        {/* วันที่ชำระเงิน */}
        <div className="pm-form-group">
          <label htmlFor="paymentDate">วันที่ชำระเงิน</label>
          <input
            type="date"
            id="paymentDate"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>

        {/* จำนวนเงินที่ชำระ */}
        <div className="pm-form-group">
          <label htmlFor="paymentAmount">จำนวนเงินที่ชำระ</label>
          <input
            type="number"
            id="paymentAmount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* ผู้ชำระเงิน */}
        <div className="pm-form-group">
          <label htmlFor="payerName">ผู้ชำระเงิน</label>
          <input
            type="text"
            id="payerName"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder="ชื่อผู้ชำระเงิน"
          />
        </div>

        {/* โอนเงินจากธนาคาร (เฉพาะ UI) */}
        <div className="pm-form-group">
          <label htmlFor="fromBank">โอนเงินจาก</label>
          <select
            id="fromBank"
            value={fromBank}
            onChange={(e) => setFromBank(e.target.value)}
          >
            <option value="">เลือกธนาคาร</option>
            {bankOptions.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* โอนไปยังธนาคาร (เฉพาะ UI) */}
        <div className="pm-form-group">
          <label htmlFor="toBank">โอนไปยัง</label>
          <select
            id="toBank"
            value={toBank}
            onChange={(e) => setToBank(e.target.value)}
          >
            <option value="">เลือกธนาคาร</option>
            {bankOptions.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* หมายเหตุ */}
        <div className="pm-form-group">
          <label htmlFor="remark">หมายเหตุ</label>
          <textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="กรอกหมายเหตุ (ถ้ามี)"
          />
        </div>

        {/* แนบไฟล์หลักฐานการโอน หรือเอกสารอื่น ๆ */}
        <div className="pm-form-group">
          <label htmlFor="attachment">แนบไฟล์</label>
          <input
            type="file"
            id="attachment"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>

        {/* ปุ่มบันทึก / ยกเลิก */}
        <div className="pm-button-group">
          <button type="submit" >บันทึก</button>
          <button type="reset">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}

export default PM;
