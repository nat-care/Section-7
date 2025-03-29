import React, { useState, useRef } from 'react';
import './RequisitionForm.css';
import html2pdf from 'html2pdf.js';

const RequisitionForm = () => {
  const formRef = useRef();

  const [formData, setFormData] = useState({
    rpNo: '____',
    date: '____',
    requesterName: '____',
    employeeCode: '____',
    senderName: '____',
    reason: '____',
    items: [{ id: 1, description: '', quantity: '', unit: '', unitPrice: '', total: '' }],
    remarks: '__________',
    //////////////////////////////////
    requesterSignature: '',
    requesterDate: '',
    approverSignature: '',
    approverDate: '',
    warehouseSignature: '',
    warehouseDate: '',
  });

  const generatePDF = () => {
    html2pdf().from(formRef.current).save('RequisitionForm.pdf');
  };

  return (
    <div className="requisition-page-wrapper">
      <div className="requisition-form-container" ref={formRef}>
        <h2 className="requisition-title">ใบรับเบิก</h2>

        <div className="requisition-info-section">
          <div className="requisition-right-align">
            <div className="requisition-rowNO">
              <span className="requisition-label">RP.NO:</span>
              <span className="requisition-value">{formData.rpNo}</span>
            </div>
            <div className="requisition-rowData">
              <span className="requisition-label">วันที่:</span>
              <span className="requisition-value">{formData.date}</span>
            </div>
          </div>

          <div className="requisition-rowName">
            <span className="requisition-label">ชื่อผู้เบิก:</span>
            <span className="requisition-value">{formData.requesterName}</span>
          </div>
          <div className="requisition-rownumber">
            <span className="requisition-label">รหัสพนักงาน:</span>
            <span className="requisition-value">{formData.employeeCode}</span>
          </div>
          <div className="requisition-rowNameS">
            <span className="requisition-label">ชื่อผู้ส่ง:</span>
            <span className="requisition-value">{formData.senderName}</span>
          </div>
          <div className="requisition-rowway">
            <span className="requisition-label">เหตุผลการเบิก:</span>
            <span className="requisition-value">{formData.reason}</span>
          </div>
        </div>

        <h3 className="requisition-item-header">รายการที่ขอเบิก</h3>
        <table className="requisition-table">
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

        <div className="requisition-remarks-section">
          <span className="requisition-label">หมายเหตุ:</span>
          <span className="requisition-value">{formData.remarks}</span>
        </div>

        <div className="requisition-signatures">
          <div className="requisition-signature-block">
            <span className="requisition-label">ผู้ขอเบิก</span>
            <br />
            <span className="requisition-value">{formData.requesterSignature || '______________________'}</span>
            <br />
            <span className="requisition-label">วันที่</span>
            <span className="requisition-value">______________________</span>
          </div>
          <div className="requisition-signature-block">
            <span className="requisition-label">หัวหน้าฝ่าย / ผู้อนุมัติ</span>
            <br />
            <span className="requisition-value">{formData.approverSignature || '______________________'}</span>
            <br />
            <span className="requisition-label">วันที่</span>
            <span className="requisition-value">______________________</span>
          </div>
          <div className="requisition-signature-block">
            <span className="requisition-label">เจ้าหน้าที่คลัง</span>
            <br />
            <span className="requisition-value">{formData.warehouseSignature || '______________________'}</span>
            <br />
            <span className="requisition-label">วันที่</span>
            <span className="requisition-value">______________________</span>
          </div>
        </div>
      </div>

      <div className="requisition-pdf-button-container">
        <button className="requisition-pdf-button" onClick={generatePDF}>บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default RequisitionForm;
