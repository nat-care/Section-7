import React from 'react';
import './PurchaseRequisition.css';

const PurchaseRequisition = () => {
  const generatePDF = () => {
    const element = document.getElementById('requisition-content');
    const opt = {
      margin: 0.5,
      filename: 'purchase_requisition.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container">
      <div className="purchase-requisition" id="requisition-content">
        <h1>ใบขอซื้อ</h1>

        <div className="row">
          <div className="column">
            <span className="label">PR.NO:</span>
            <span className="value">PR-2025-003</span>
          </div>
          <div className="column">
            <span className="label">วันที่:</span>
            <span className="value">20 มี.ค. 2567</span>
          </div>
        </div>

        <div className="row">
          <div className="column">
            <span className="label">วันที่ต้องการใช้:</span>
            <span className="value">25 มี.ค. 2567</span>
          </div>
          <div className="column">
            <span className="label">แผนก:</span>
            <span className="value">ฝ่ายจัดซื้อ</span>
          </div>
        </div>

        <div className="section">
          <span className="label">ตำแหน่ง:</span>
          <span className="value">พนักงานจัดซื้อ</span>
        </div>

        <div className="section">
          <span className="label">เรื่อง:</span>
          <span className="value">จัดซื้อเครื่องมือสำนักงาน</span>
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
            <tr>
              <td>1</td>
              <td>คอมพิวเตอร์ Lenovo</td>
              <td>5</td>
              <td>เครื่อง</td>
              <td>20,000 บาท</td>
              <td>100,000 บาท</td>
            </tr>
          </tbody>
        </table>

        <div className="section">
          <span className="label">หมายเหตุ:</span>
          <span className="value">กรุณาตรวจสอบข้อมูลให้ครบถ้วน</span>
        </div>

        <div className="signatures">
          <div className="signature-block">
            <span className="label">ผู้อนุมัติ</span>
            <br />
            <span className="value">(..............................)</span>
            <br />
            <div className="date">วันที่ .....................</div>
          </div>

          <div className="signature-block">
            <span className="label">เจ้าหน้าที่ฝ่ายจัดซื้อ</span>
            <br />
            <span className="value">(..............................)</span>
            <br />
            <div className="date">วันที่ .....................</div>
          </div>
        </div>
      </div>

      {/* ปุ่มบันทึกเป็น PDF อยู่ด้านล่างของกล่องเอกสาร */}
      <div className="pdf-button-container">
        <button onClick={generatePDF} className="pdf-button">บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default PurchaseRequisition;
