import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./PurchaseRequisition.css";
import html2pdf from "html2pdf.js";

const PurchaseDocument = () => {
  const documentRef = useRef();

  // กำหนดข้อมูลใน state ให้ครบทุก field
  const [formData, setFormData] = useState({
    prNo: "PO12345",
    date: "2025-03-26",
    desiredDate: "2025-04-01",
    department: "IT",
    position: "Manager",
    subject: "Purchase Order for Laptops",
    items: [
      { id: 1, description: "Laptop", quantity: 5, unit: "pcs", unitPrice: 20000, total: 100000 },
      { id: 2, description: "Monitor", quantity: 3, unit: "pcs", unitPrice: 5000, total: 15000 },
      { id: 3, description: "Keyboard", quantity: 10, unit: "pcs", unitPrice: 300, total: 3000 }
    ],
    note: "Please process this order as soon as possible.",
    approvalSignature: "John Doe",
    approvalDate: "2025-03-25",
    purchasingSignature: "Jane Smith",
    purchasingDate: "2025-03-26"
  });

  // ฟังก์ชันสำหรับพิมพ์เป็น PDF (ผ่าน react-to-print)
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: "Purchase Document"
  });

  // ฟังก์ชันสร้าง PDF ด้วย html2pdf
  const generatePDF = () => {
    const element = documentRef.current;
    const opt = {
      margin: 0.5,
      filename: "purchase_document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container">
      {/* เอกสารใบจัดซื้อ */}
      <div className="document-container" ref={documentRef}>
      <h2 style={{ textAlign: 'center', marginTop: '0' }}>ใบจัดซื้อ</h2>
       

        {/* ส่วนหัวของเอกสาร */}
        <div className="document-header">
          <div className="header-right">
            <p>PR.NO: {formData.prNo}</p>
            <p>วันที่: {formData.date}</p>
          </div>
        </div>

        {/* ส่วนรายละเอียด */}
        <div className="document-section">
          <p>วันที่ต้องการใช้: {formData.desiredDate}</p>
          <p>
            แผนก: {formData.department} ตำแหน่ง: {formData.position}
          </p>
          <p>เรื่อง: {formData.subject}</p>
        </div>

        {/* ตารางรายการสินค้า */}
        <table className="document-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วย</th>
              <th>ราคาต่อหน่วย</th>
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.unitPrice}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* หมายเหตุ */}
        <div className="document-section">
          <p>หมายเหตุ: {formData.note}</p>
        </div>

        {/* ลายเซ็น */}
        <div className="signature-section">
          <div className="signature-block">
            <p>ผู้อนุมัติฝ่ายจัดซื้อ</p>
            <div className="signature-line">{formData.approvalSignature}</div>
            <p>วันที่: {formData.approvalDate}</p>
          </div>
          <div className="signature-block">
            <p>เจ้าหน้าที่ฝ่ายจัดซื้อ</p>
            <div className="signature-line">{formData.purchasingSignature}</div>
            <p>วันที่: {formData.purchasingDate}</p>
          </div>
        </div>
      </div>

      {/* ปุ่มพิมพ์เป็น PDF (นอกกรอบของเอกสาร) */}
      <div className="pdf-button-container">
        <button onClick={generatePDF} className="pdf-button">
          บันทึกเป็น PDF
        </button>
      </div>
    </div>
  );
};

export default PurchaseDocument;
