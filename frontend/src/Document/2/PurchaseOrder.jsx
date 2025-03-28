import React, { useState } from "react";
import "./PurchaseOrder.css";  // อย่าลืมสร้างไฟล์ CSS สำหรับ styling
import html2pdf from 'html2pdf.js';

const PurchaseOrder = () => {
  const [formData, setFormData] = useState({
    prno: "PO12345",
    date: "25 มีนาคม 2565",
    requiredDate: "30 มีนาคม 2565",
    department: "IT",
    position: "Manager",
    subject: "Purchase of Laptops",
    items: [
      { id: 1, description: "Laptop", quantity: 5, unit: "pcs", pricePerUnit: 15000, total: 75000 },
      { id: 2, description: "Mouse", quantity: 10, unit: "pcs", pricePerUnit: 500, total: 5000 }
    ],
    discount: 0,
    vat: 0.07,
    totalAmount: 80000,
    paymentConditions: "ชำระเงินก่อนรับสินค้า",
    approverSignature: "",
    purchaserSignature: "",
    inspectorSignature: "",
  });

  // คำนวณภาษีและรวมยอดโดยการปัดเศษ
  const vatAmount = Math.round((formData.totalAmount - formData.discount) * formData.vat);
  const totalWithVat = Math.round(formData.totalAmount - formData.discount + vatAmount);

  const generatePDF = () => {
    const element = document.getElementById('receipt-content');
    const opt = {
      margin: 0.5,
      filename: 'purchase_order.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <div id="receipt-content" className="purchase-order">
      <h2 style={{ textAlign: 'center', marginTop: '0' }}>ใบสั่งซื้อ</h2>

        {/* รายละเอียด */}
        <div className="section">
          <div className="document-header">
            <div className="header-right">
              <p>PR.NO: ______________________</p>
              <p>วันที่: ______________________</p>
            </div>
          </div>
          
          <div className="row">
            <div className="column">
              <span className="label21">วันที่ต้องการใช้: </span>
              <span className="value1">{formData.requiredDate}</span>
            </div>
            <div className="column">
              <span className="label527">แผนก: </span>
              <span className="value1">{formData.department}</span>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <span className="label45">ตำแหน่ง: </span>
              <span className="value1">{formData.position}</span>
            </div>
            <div className="column">
              <span className="label452">เรื่อง: </span>
              <span className="value1">{formData.subject}</span>
            </div>
          </div>
        </div>

        {/* ตารางสินค้า */}
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วยนับ</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.total}</td>
              </tr>
            ))}

            {/* แถวสรุปยอด */}
            <tr>
              <td colSpan="4" className="summary-label">รวมเป็นเงิน:</td>
              <td className="summary-value">{formData.totalAmount}</td>
            </tr>
            <tr>
              <td colSpan="4" className="summary-label">ส่วนลด:</td>
              <td className="summary-value">{formData.discount}</td>
            </tr>
            <tr>
              <td colSpan="4" className="summary-label">ภาษีมูลค่าเพิ่ม 7%:</td>
              <td className="summary-value">{vatAmount}</td>
            </tr>
            <tr>
              <td colSpan="4" className="summary-label">รวมเป็นเงินทั้งสิ้น:</td>
              <td className="summary-value">{totalWithVat}</td>
            </tr>
          </tbody>
        </table>

        {/* เงื่อนไขการชำระเงิน */}
        <br />
        <div className="payment-conditions">
          <div className="payment-condition">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินก่อนรับสินค้า"} />
            <span>ชำระเงินก่อนรับสินค้า</span>
          </div>
          <div className="payment-condition">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินหลังได้รับสินค้า"} />
            <span>ชำระเงินหลังได้รับสินค้า</span>
          </div>
          <div className="payment-condition">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินแบบเครดิต"} />
            <span>ชำระเงินแบบเครดิต</span>
          </div>
          <div className="payment-condition">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินเป็นงวดตามสัญญา"} />
            <span>ชำระเงินเป็นงวดตามสัญญา</span>
          </div>
        </div>

        {/* ลงชื่อ */}
        <div className="signatures">
          <div className="signature">
            <span className="label">ผู้มีอำนาจ</span>
            <br />
            <span className="value">______________________</span>
            <br />
            <div className="date">วันที่ ______________________</div>
          </div>
          <div className="signature">
            <span className="label">ผู้จัดซื้อ</span>
            <br />
            <span className="value">______________________</span>
            <br />
            <div className="date">วันที่ ______________________</div>
          </div>
          <div className="signature">
            <span className="label">ผู้ตรวจสอบ</span>
            <br />
            <span className="value">______________________</span>
            <br />
            <div className="date">วันที่ ______________________</div>
          </div>
        </div>
      </div>

      {/* ปุ่ม PDF ข้างนอกกรอบ */}
      <div className="pdf-button-container">
        <button onClick={generatePDF} className="pdf-button">บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default PurchaseOrder;
