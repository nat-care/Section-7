import React from 'react';
import './Invoice.css';

const Invoice = () => {
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
            <p>รหัสอ้างอิง: 12345</p>
            <p>บริษัท: บริษัท ABC</p>
            <p>ที่อยู่: ถนน XYZ</p>
            <p>Email: example@company.com</p>
          </div>
          <div className="half">
            <h3>ผู้ชำระหนี้</h3>
            <p>รหัสอ้างอิง: 67890</p>
            <p>บริษัท: บริษัท DEF</p>
            <p>ที่อยู่: ถนน ABC</p>
            <p>Email: customer@company.com</p>
            <p>Tax ID: 123-456-7890</p>
          </div>
        </div>

        <div className="section">
          <h3>รายละเอียด</h3>
          <p>รายละเอียดการขายสินค้า/บริการต่างๆ</p>
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
              <td>สินค้า A</td>
              <td>10</td>
              <td>ชิ้น</td>
              <td>500 บาท</td>
              <td>5,000 บาท</td>
            </tr>
            <tr>
              <td colSpan="5">ส่วนลด 1%</td>
              <td>-50 บาท</td>
            </tr>
            <tr>
              <td colSpan="5">ภาษีมูลค่าเพิ่ม 7%</td>
              <td>350 บาท</td>
            </tr>
            <tr>
              <td colSpan="5">รวมสุทธิ</td>
              <td>5,300 บาท</td>
            </tr>
          </tbody>
        </table>

        <div className="signatures">
          <div className="signature">
            <p>ผู้มีอำนาจออกใบแจ้งหนี้</p>
            <p>(......................................)</p>
            <p>วันที่ ......................................</p>
          </div>
          <div className="signature">
            <p>ผู้ชำระหนี้</p>
            <p>(......................................)</p>
            <p>วันที่ ......................................</p>
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
