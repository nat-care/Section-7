import React, { useState } from 'react';
import './Invoice.css';
import html2pdf from 'html2pdf.js';

const Invoice = () => {
  // กำหนดข้อมูลใบแจ้งหนี้ใน state
  const [invoiceData, setInvoiceData] = useState({
    issuer: {
      ref: "12345",
      company: "บริษัท ABC จำกัด",
      address: "123 ถนน XYZ, แขวง ABC, เขต DEF, กรุงเทพมหานคร",
      email: "example@company.com",
    },
    payer: {
      ref: "67890",
      company: "บริษัท DEF จำกัด",
      address: "456 ถนน ABC, แขวง DEF, เขต GHI, กรุงเทพมหานคร",
      email: "customer@company.com",
      taxId: "123-456-7890",
    },
    details: "รายละเอียดการขายสินค้า/บริการ: จำหน่ายสินค้า Office Supplies และบริการดูแลระบบ",
    items: [
      { id: 1, description: "สินค้า A", quantity: 10, unit: "ชิ้น", unitPrice: 500, total: 5000 },
      { id: 2, description: "สินค้า B", quantity: 5, unit: "ชิ้น", unitPrice: 800, total: 4000 },
    ],
    discount: 0.01, // 1%
    vat: 0.07, // 7%
    // คำนวณยอดรวม ตัวอย่างคำนวณอย่างง่าย:
    subtotal: 9000,
    discountAmount: 90, // 9000 * 0.01
    vatAmount: 623, // (9000 - 90) * 0.07 ≈ 623
    total: 9533, // 9000 - 90 + 623
    signatures: {
      issuerSignature: "นายสมชาย ใจดี",
      issuerDate: "2025-03-26",
      payerSignature: "นางสาวสมปอง พอใจ",
      payerDate: "2025-03-27",
    },
  });

  const generatePDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 0.5,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="invoice-container">
      <div className="invoice" id="invoice-content">
        <h1>ใบแจ้งหนี้</h1>

        <div className="row">
          <div className="half">
            <h3>ผู้แจ้งหนี้</h3>
            <p>รหัสอ้างอิง: {invoiceData.issuer.ref}</p>
            <p>บริษัท: {invoiceData.issuer.company}</p>
            <p>ที่อยู่: {invoiceData.issuer.address}</p>
            <p>Email: {invoiceData.issuer.email}</p>
          </div>
          <div className="half">
            <h3>ผู้ชำระหนี้</h3>
            <p>รหัสอ้างอิง: {invoiceData.payer.ref}</p>
            <p>บริษัท: {invoiceData.payer.company}</p>
            <p>ที่อยู่: {invoiceData.payer.address}</p>
            <p>Email: {invoiceData.payer.email}</p>
            <p>Tax ID: {invoiceData.payer.taxId}</p>
          </div>
        </div>

        <div className="section">
          <h3>รายละเอียด</h3>
          <p>{invoiceData.details}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วยนับ</th>
              <th>ราคาต่อหน่วย</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.unitPrice} บาท</td>
                <td>{item.total} บาท</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5">ส่วนลด {invoiceData.discount * 100}%</td>
              <td>- {invoiceData.discountAmount} บาท</td>
            </tr>
            <tr>
              <td colSpan="5">ภาษีมูลค่าเพิ่ม {invoiceData.vat * 100}%</td>
              <td>{invoiceData.vatAmount} บาท</td>
            </tr>
            <tr>
              <td colSpan="5">รวมสุทธิ</td>
              <td>{invoiceData.total} บาท</td>
            </tr>
          </tbody>
        </table>

        <div className="signatures">
          <div className="signature">
            <p>ผู้มีอำนาจออกใบแจ้งหนี้</p>
            <p>{invoiceData.signatures.issuerSignature}</p>
            <p>วันที่: {invoiceData.signatures.issuerDate}</p>
          </div>
          <div className="signature">
            <p>ผู้ชำระหนี้</p>
            <p>{invoiceData.signatures.payerSignature}</p>
            <p>วันที่: {invoiceData.signatures.payerDate}</p>
          </div>
        </div>
      </div>

      {/* ปุ่มบันทึกเป็น PDF */}
      <div className="pdf-button-container">
        <button onClick={generatePDF} className="pdf-button">บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default Invoice;
