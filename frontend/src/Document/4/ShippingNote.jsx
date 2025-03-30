import React, { useState, useRef } from 'react';
import './ShippingNote.css';
import html2pdf from 'html2pdf.js';

const ShippingNote = () => {
  const noteRef = useRef();

  const [noteData, setNoteData] = useState({
    rpNo: '_________',
    date: '_________',
    recipientName: '_________',
    employeeCode: '_________',
    details: '_________',
    items: [{ id: 1, description: '', quantity: '', unit: '', unitPrice: '', total: '' }],
    companyName: '_________',
    transportNumber: '_________',
    remarks: '_________',
    senderSignature: '_________',
    senderDate: '_________',
    recipientSignature: '_________',
    recipientDate: '_________',
  });

  const generatePDF = () => {
    const element = noteRef.current;
    html2pdf().from(element).save('ShippingNote.pdf');
  };

  return (
    <div className="shipping-note-page">
      <div className="shipping-note-container" ref={noteRef}>

        <h2 className="shipping-note-title">ใบส่งพัสดุ</h2>

        <div className="shipping-note-info">
          <div className="shipping-note-row">
            <span className="shipping-note-label">RP.NO:</span>
            <span className="shipping-note-value">{noteData.rpNo}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">วันที่:</span>
            <span className="shipping-note-value">{noteData.date}</span>
          </div>

          <div className="shipping-note-row">
            <span className="shipping-note-label">ชื่อผู้รับ:</span>
            <span className="shipping-note-value">{noteData.recipientName}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">รหัสพนักงาน:</span>
            <span className="shipping-note-value">{noteData.employeeCode}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">รายละเอียด:</span>
            <span className="shipping-note-value">{noteData.details}</span>
          </div>
        </div>

        <h3 className="shipping-note-subtitle">รายการพัสดุ</h3>
        <table className="shipping-note-table">
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
            {noteData.items.map((item, index) => (
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

        <div className="shipping-note-info">
          <div className="shipping-note-row">
            <span className="shipping-note-label">ชื่อบริษัท:</span>
            <span className="shipping-note-value">{noteData.companyName}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">หมายเลขขนส่ง:</span>
            <span className="shipping-note-value">{noteData.transportNumber}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">หมายเหตุ:</span>
            <span className="shipping-note-value">{noteData.remarks}</span>
          </div>
        </div>

        <div className="shipping-note-signatures">
          <div className="shipping-note-signature">
            <span className="shipping-note-label">ลงชื่อผู้ส่งพัสดุ</span>
            <span className="shipping-note-value">______________________</span>
            <br />
            <span className="shipping-note-label">วันที่</span>
            <span className="shipping-note-value">______________________</span>
          </div>
          <div className="shipping-note-signature">
            <span className="shipping-note-label">ลงชื่อผู้รับพัสดุ</span>
            <span className="shipping-note-value">______________________</span>
            <br />
            <span className="shipping-note-label">วันที่ </span>
            <span className="shipping-note-value">______________________</span>
          </div>
        </div>
      </div>

      <div className="shipping-note-button-container">
        <button onClick={generatePDF} className="shipping-note-button">บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default ShippingNote;
