import React, { useState, useRef } from 'react';
import './RequisitionForm.css';
import html2pdf from 'html2pdf.js';

const RequisitionForm = () => {
  const formRef = useRef();

  const [formData, setFormData] = useState({
    rpNo: '',
    date: '',
    requesterName: '',
    employeeCode: '',
    senderName: '',
    reason: '',
    items: [{ id: 1, description: '', quantity: '', unit: '', unitPrice: '', total: '' }],
    remarks: '',
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
    <div className="page-wrapper">
      <div className="requisition-form" ref={formRef}>
        <h1>ใบรับเบิก</h1>

        <div className="info-section">
          <div className="row">
            <span className="label">RP.NO:</span>
            <span className="value">{formData.rpNo}</span>
          </div>
          <div className="row">
            <span className="label">วันที่:</span>
            <span className="value">{formData.date}</span>
          </div>
          <div className="row">
            <span className="label">ชื่อผู้เบิก:</span>
            <span className="value">{formData.requesterName}</span>
          </div>
          <div className="row">
            <span className="label">รหัสพนักงาน:</span>
            <span className="value">{formData.employeeCode}</span>
          </div>
          <div className="row">
            <span className="label">ชื่อผู้ส่ง:</span>
            <span className="value">{formData.senderName}</span>
          </div>
          <div className="row">
            <span className="label">เหตุผลการเบิก:</span>
            <span className="value">{formData.reason}</span>
          </div>
        </div>

        <h3>รายการที่ขอเบิก</h3>
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

        <div className="remarks-section">
          <span className="label">หมายเหตุ:</span>
          <span className="value">{formData.remarks}</span>
        </div>

        <div className="signatures-3">
          <div className="signature-block">
            <span className="label">ผู้ขอเบิก</span>
            <br />
            <span className="value"> ( {formData.requesterSignature || '....................'} )</span>
            <br />
            <span className="label">วันที่</span>
            <span className="value">........................</span>
          </div>
          <div className="signature-block">
            <span className="label">หัวหน้าฝ่าย / ผู้อนุมัติ</span>
            <br />
            <span className="value"> ( {formData.approverSignature || '....................'} )</span>
            <br />
            <span className="label">วันที่</span>
            <span className="value">........................</span>
          </div>
          <div className="signature-block">
            <span className="label">เจ้าหน้าที่คลัง</span>
            <br />
            <span className="value"> ( {formData.warehouseSignature || '....................'} )</span>
            <br />
            <span className="label">วันที่</span>
            <span className="value">........................</span>
          </div>
        </div>
      </div>

      <div className="pdf-button-container">
        <button className="pdf-button" onClick={generatePDF}>บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default RequisitionForm;
