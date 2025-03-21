import React, { useState, useEffect, useRef } from 'react';
import './ShippingNote.css';
import html2pdf from 'html2pdf.js';

const ShippingNote = () => {
  const noteRef = useRef();

  const [noteData, setNoteData] = useState({
    rpNo: '',
    date: '',
    recipientName: '',
    employeeCode: '',
    details: '',
    items: [{ id: 1, description: '', quantity: '', unit: '', unitPrice: '', total: '' }],
    companyName: '',
    transportNumber: '',
    remarks: '',
    senderSignature: '',
    senderDate: '',
    recipientSignature: '',
    recipientDate: '',
  });

  const generatePDF = () => {
    const element = noteRef.current;
    html2pdf().from(element).save('ShippingNote.pdf');
  };

  return (
    <div className="page-wrapper">
      <div className="shipping-note" ref={noteRef}>
        <h1>ใบส่งพัสดุ</h1>

        <div className="info-section">
          <div className="row">
            <span className="label">RP.NO:</span>
            <span className="value">{noteData.rpNo}</span>
          </div>
          <div className="row">
            <span className="label">วันที่:</span>
            <span className="value">{noteData.date}</span>
          </div>
          <div className="row">
            <span className="label">ชื่อผู้รับ:</span>
            <span className="value">{noteData.recipientName}</span>
          </div>
          <div className="row">
            <span className="label">รหัสพนักงาน:</span>
            <span className="value">{noteData.employeeCode}</span>
          </div>
          <div className="row">
            <span className="label">รายละเอียด:</span>
            <span className="value">{noteData.details}</span>
          </div>
        </div>

        <h3>รายการพัสดุ</h3>
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

        <div className="info-section remarks-section">
          <div className="row">
            <span className="label">ชื่อบริษัท:</span>
            <span className="value">{noteData.companyName}</span>
          </div>
          <div className="row">
            <span className="label">หมายเลขขนส่ง:</span>
            <span className="value">{noteData.transportNumber}</span>
          </div>
          <div className="row">
            <span className="label">หมายเหตุ:</span>
            <span className="value">{noteData.remarks}</span>
          </div>
        </div>

        <div className="signatures-vertical">
          <div className="signature-block">
            <span className="label">ลงชื่อผู้ส่งพัสดุ</span>
            <span className="value">(................................................)</span>
            <br />
            <span className="label">วันที่</span>
            <span className="value">(..................................)</span>
          </div>
          <div className="signature-block">
            <span className="label">ลงชื่อผู้รับพัสดุ</span>
            <span className="value">(................................................)</span>
            <br />
            <span className="label">วันที่ </span>
            <span className="value">(..................................)</span>
          </div>
        </div>
      </div>

      {/* ปุ่ม PDF อยู่นอกกล่อง */}
      <div className="pdf-button-container">
        <button className="pdf-button" onClick={generatePDF}>บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default ShippingNote;
