import React from 'react';
import './DeliveryReceipt.css';
import html2pdf from 'html2pdf.js';

const DeliveryReceipt = () => {
  const generatePDF = () => {
    const element = document.getElementById('receipt-content');
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
      {/* กล่องห่อเพื่อจัดกลางหน้า */}
      <div className="page-wrapper">
        <div className="delivery-receipt" id="receipt-content">
          <h3 style={{ textAlign: 'center', marginBottom: '0' }}>ใบรับพัสดุ (Delivery Receipt)</h3>
          <h2 style={{ textAlign: 'center', marginTop: '0' }}>ใบรับพัสดุ</h2>

          <div className="row">
            <div className="column-right">
              ID-PR.NO. ___________________________<br />
              PR.NO. ___________________________<br />
              วันที่ ___________________________
            </div>
          </div>

          <p>ชื่อพนักงาน ____________________________________________</p>
          <p>รหัสพนักงาน ____________________________________________</p>
          <p>แผนก ____________________________ ตำแหน่ง ____________________________</p>
          <p>รายละเอียด ____________________________________________</p>
          <p>ตามสินค้า ____________________________________________</p>
          <p>วันที่ครบกำหนด ____________________________________________</p>
          <p>วันที่ส่งมอบสินค้า ____________________________________________</p>
          <p>ตรวจรับสินค้าตาม ____________________________________________</p>
          <p>ได้รับสินค้า ____________________________________________</p>

          <p>รายละเอียด</p>
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
              {[1, 2, 3, 4].map((num) => (
                <tr key={num}>
                  <td>{num}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>หมายเหตุ: กรุณาส่งแบบฟอร์มฉบับงานเมื่อเสร็จของ</p>

          <div className="signatures">
            <div className="signature-block">
              ผู้ส่งพัสดุ _______________________<br />
              วันที่ [ ___________________ ]
            </div>
            <div className="signature-block">
              ผู้รับพัสดุ _______________________<br />
              วันที่ [ ___________________ ]
            </div>
          </div>
        </div>
      </div>

      {/* ปุ่ม PDF */}
      <div className="pdf-button-container">
        <button onClick={generatePDF} className="pdf-button">บันทึกเป็น PDF</button>
      </div>
    </>
  );
};

export default DeliveryReceipt;
