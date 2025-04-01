import React, { useState, useEffect } from 'react';
import './Invoice.css';
import axios from 'axios';

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  // ฟังก์ชันสำหรับฟอร์แมตตัวเลขให้มีคอมม่าและแสดงทศนิยม 2 ตำแหน่ง
  const formatCurrency = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const fetchLatestInvoice = async () => {
      try {
        const response = await axios.get("http://localhost:3000/invoices/latest");
        const data = response.data;

        const subtotal = data.products.reduce(
          (sum, p) => sum + Number(p.totalAmount || 0),
          0
        );
        const discountRate = parseFloat(data.discount || 0) / 100;
        const vatRate = 0.07; // บังคับภาษี 7%
        const discountAmount = subtotal * discountRate;
        const vatAmount = (subtotal - discountAmount) * vatRate;
        const total = subtotal - discountAmount + vatAmount;

        setInvoiceData({
          issuer: {
            ref: data.idIV,
            company: data.companyName,
            address: data.companyAddress,
            email: data.email1,
          },
          payer: {
            ref: data.department,
            company: data.companyThatMustPay,
            address: data.companyAddress2,
            email: data.email2,
            taxId: data.taxID,
          },
          details: data.detail,
          items: data.products.map((p, i) => ({
            id: i + 1,
            description: p.item,
            quantity: parseFloat(p.quantity),
            unit: p.unit,
            unitPrice: parseFloat(p.unitPrice),
            total: parseFloat(p.totalAmount),
          })),
          discount: discountRate,
          vat: vatRate,
          subtotal,
          discountAmount,
          vatAmount,
          total,
          signatures: {
            issuerSignature: data.approver,
            issuerDate: data.dateApproval,
            payerSignature: data.staff,
            payerDate: data.dateApproval2,
          },
        });
      } catch (error) {
        console.error("Error fetching latest invoice:", error);
      }
    };

    fetchLatestInvoice();
  }, []);

  // ฟังก์ชันสำหรับเรียกหน้าต่างพิมพ์
  const printInvoice = () => {
    window.print();
  };

  if (!invoiceData) {
    return <p>กำลังโหลดข้อมูลใบแจ้งหนี้...</p>;
  }

  return (
    <div className="invoice-container">
      <div className="invoice-content" id="invoice-content">
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

        <table className="invoice-table">
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
                <td>{formatCurrency(item.unitPrice)} บาท</td>
                <td>{formatCurrency(item.total)} บาท</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5">ส่วนลด {invoiceData.discount * 100}%</td>
              <td>- {formatCurrency(invoiceData.discountAmount)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5">ภาษีมูลค่าเพิ่ม 7%</td>
              <td>{formatCurrency(invoiceData.vatAmount)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5"><strong>รวมสุทธิ</strong></td>
              <td><strong>{formatCurrency(invoiceData.total)} บาท</strong></td>
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
            <p>ผู้อนุมัติ</p>
            <p>{invoiceData.signatures.payerSignature}</p>
            <p>วันที่: {invoiceData.signatures.payerDate}</p>
          </div>
        </div>
      </div>

      <div className="print-button-container">
        <button onClick={printInvoice} className="print-button">พิมพ์ใบแจ้งหนี้</button>
      </div>
    </div>
  );
};

export default Invoice;
