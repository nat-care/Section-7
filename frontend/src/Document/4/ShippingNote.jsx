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
    <div className="page-wrapper">
  <div className="shipping-note" ref={noteRef}>
  
    <h2 style={{ textAlign: 'center', marginTop: '0' }}>ใบส่งพัสดุ</h2>

    <div className="info-section">
      <div className="row-info">
        <span className="info-section-label">RP.NO:</span>
        <span className="info-section-value">{noteData.rpNo}</span>
      </div>
      <div className="row-info">
        <span className="info-section-label">วันที่:</span>
        <span className="info-section-value">{noteData.date}</span>
      </div>

      <div className="rowname">
        <span className="label">ชื่อผู้รับ:</span>
        <span className="value">{noteData.recipientName}</span>
      </div>
      <div className="rownumber">
        <span className="label">รหัสพนักงาน:</span>
        <span className="value">{noteData.employeeCode}</span>
      </div>
      <div className="rowlow">
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
      <div className="rowwork">
        <span className="label">ชื่อบริษัท:</span>
        <span className="value">{noteData.companyName}</span>
      </div>
      <div className="rownamenow">
        <span className="label">หมายเลขขนส่ง:</span>
        <span className="value">{noteData.transportNumber}</span>
      </div>
      <div className="rowae">
        <span className="label">หมายเหตุ:</span>
        <span className="value">{noteData.remarks}</span>
      </div>
    </div>

    <div className="signatures-vertical">
      <div className="signature-block">
        <span className="label">ลงชื่อผู้ส่งพัสดุ</span>
        <span className="value">______________________</span>
        <br />
        <span className="label">วันที่</span>
        <span className="value">______________________</span>
      </div>
      <div className="signature-block">
        <span className="label">ลงชื่อผู้รับพัสดุ</span>
        <span className="value">______________________</span>
        <br />
        <span className="label">วันที่ </span>
        <span className="value">______________________</span>
      </div>
    </div>
  </div>

  {/* ปุ่มสำหรับการสร้าง PDF (นอกกรอบของเอกสาร) */}
  <div className="pdf-button-container">
    <button onClick={generatePDF} className="pdf-button">บันทึกเป็น PDF</button>
  </div>
</div>

  );
};

export default ShippingNote;
