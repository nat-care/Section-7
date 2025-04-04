import { useRef } from 'react';
import { useLocation } from "react-router-dom";
import './ShippingNote.css';
import html2pdf from 'html2pdf.js';

const ShippingNote = () => {
  const noteRef = useRef();
  const location = useLocation();

  const noteData = location.state?.noteData || {
    idSN: "",
    dateSN: "",
    employeeName: "",
    employeePosition: "",
    senderName: "",
    detail: "",
    products: [],
    totalAmount: "",
    notes: "",
    sender: "",
    reciver: "",
    dateApproval: "",
    dateApproval2: "",
    parcelNumber: "",
    comments: "",
    transportCompany: "",
  };

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
            <span className="shipping-note-value">{noteData.idSN}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">วันที่:</span>
            <span className="shipping-note-value">{noteData.dateSN}</span>
          </div>

          <div className="shipping-note-row">
            <span className="shipping-note-label">ชื่อผู้รับ:</span>
            <span className="shipping-note-value">{noteData.employeeName}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">รหัสพนักงาน:</span>
            <span className="shipping-note-value">{noteData.employeePosition}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">รายละเอียด:</span>
            <span className="shipping-note-value">{noteData.detail}</span>
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
            {noteData.products.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.unitPrice}</td>
                <td>{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="shipping-note-info">
          <div className="shipping-note-row">
            <span className="shipping-note-label">ชื่อบริษัท:</span>
            <span className="shipping-note-value">{noteData.transportCompany}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">หมายเลขขนส่ง:</span>
            <span className="shipping-note-value">{noteData.parcelNumber}</span>
          </div>
          <div className="shipping-note-row">
            <span className="shipping-note-label">หมายเหตุ:</span>
            <span className="shipping-note-value">{noteData.comments}</span>
          </div>
        </div>

        <div className="shipping-note-signatures">
          <div className="shipping-note-signature">
            <span className="shipping-note-label">ลงชื่อผู้ส่งพัสดุ</span>
            <span className="shipping-note-value">{noteData.senderName}</span>
            <br />
            <span className="shipping-note-label">วันที่</span>
            <span className="shipping-note-value">{noteData.dateSN}</span>
          </div>
          <div className="shipping-note-signature">
            <span className="shipping-note-label">ลงชื่อผู้รับพัสดุ</span>
            <span className="shipping-note-value">{noteData.reciverName}</span>
            <br />
            <span className="shipping-note-label">วันที่ </span>
            <span className="shipping-note-value">{noteData.dateSN}</span>
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

