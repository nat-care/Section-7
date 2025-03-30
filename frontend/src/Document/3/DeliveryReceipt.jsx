import React, { useState } from 'react';
import './DeliveryReceipt.css';
import html2pdf from 'html2pdf.js';

const DeliveryReceipt = () => {
  const [receiptData, setReceiptData] = useState({
    idPrNo: 'ID-PR123456',
    prNo: 'PR78910',
    date: '2025-03-26',
    employeeName: 'Somchai Prasert',
    employeeCode: 'EMP001',
    department: 'Sales',
    position: 'Manager',
    details: 'Delivery of office supplies',
    product: 'Printer Paper, Ink Cartridges',
    dueDate: '2025-04-05',
    deliveryDate: '2025-03-28',
    inspection: 'Checked by supervisor',
    received: 'Received in good condition',
    items: [
      { id: 1, description: 'Printer Paper (A4)', quantity: 10, unit: 'reams', unitPrice: 150, total: 1500 },
      { id: 2, description: 'Ink Cartridge', quantity: 5, unit: 'pcs', unitPrice: 500, total: 2500 }
    ],
    note: 'Please confirm receipt within 24 hours.',
    sender: 'Warehouse Staff: Mr. Somchai',
    senderDate: '2025-03-26',
    receiver: 'Office Manager: Ms. Pranee',
    receiverDate: '2025-03-27'
  });

  const generatePDF = () => {
    const element = document.getElementById('delivery-receipt-content');
    const opt = {
      margin: 0.5,
      filename: 'delivery_receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <div className="delivery-receipt-page">
        <div className="delivery-receipt-container" id="delivery-receipt-content">
          <h2 className="delivery-receipt-title">ใบรับพัสดุ</h2>

          <div className="delivery-receipt-info">
            <p>ID-PR.NO.: {receiptData.idPrNo}</p>
            <p>PR.NO.: {receiptData.prNo}</p>
            <p>วันที่: {receiptData.date}</p>
            <p>ชื่อพนักงาน: {receiptData.employeeName}</p>
            <p>รหัสพนักงาน: {receiptData.employeeCode}</p>
            <p>แผนก: {receiptData.department} ตำแหน่ง: {receiptData.position}</p>
            <p>รายละเอียด: {receiptData.details}</p>
            <p>ตามสินค้า: {receiptData.product}</p>
            <p>วันที่ครบกำหนด: {receiptData.dueDate}</p>
            <p>วันที่ส่งมอบสินค้า: {receiptData.deliveryDate}</p>
            <p>ตรวจรับสินค้าตาม: {receiptData.inspection}</p>
            <p>ได้รับสินค้า: {receiptData.received}</p>
          </div>

          <p className="delivery-receipt-subtitle">รายละเอียด</p>
          <table className="delivery-receipt-table">
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
              {receiptData.items.map((item, index) => (
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

          <p className="delivery-receipt-note">หมายเหตุ: {receiptData.note}</p>

          <div className="delivery-receipt-signatures">
            <div className="delivery-receipt-signature">
              ผู้ส่งพัสดุ <br /> {receiptData.sender}<br />
              วันที่: {receiptData.senderDate}
            </div>
            <div className="delivery-receipt-signature">
              ผู้รับพัสดุ <br /> {receiptData.receiver}<br />
              วันที่: {receiptData.receiverDate}
            </div>
          </div>
        </div>
      </div>

      <div className="delivery-receipt-button-container">
        <button onClick={generatePDF} className="delivery-receipt-button">บันทึกเป็น PDF</button>
      </div>
    </>
  );
};

export default DeliveryReceipt;
