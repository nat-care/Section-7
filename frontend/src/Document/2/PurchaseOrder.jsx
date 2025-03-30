import React, { useState } from "react";
import "./PurchaseOrder.css";  // Import the updated CSS file
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

  const vatAmount = Math.round((formData.totalAmount - formData.discount) * formData.vat);
  const totalWithVat = Math.round(formData.totalAmount - formData.discount + vatAmount);

  const generatePDF = () => {
    const element = document.getElementById('purchase-order-content');
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
    <div className="purchase-order-page">
      <div id="purchase-order-content" className="purchase-order-container">
        <h2 className="purchase-order-title">ใบสั่งซื้อ</h2>

        {/* รายละเอียด */}
        <div className="purchase-order-details">
          <div className="purchase-order-header">
            <div className="header-right">
              <p>PR.NO: ______________________</p>
              <p>วันที่: ______________________</p>
            </div>
          </div>
          
          <div className="purchase-order-row">
            <div className="purchase-order-column">
              <span className="label">วันที่ต้องการใช้: </span>
              <span className="value">{formData.requiredDate}</span>
            </div>
            <div className="purchase-order-column">
              <span className="label">แผนก: </span>
              <span className="value">{formData.department}</span>
            </div>
          </div>
          <div className="purchase-order-row">
            <div className="purchase-order-column">
              <span className="label">ตำแหน่ง: </span>
              <span className="value">{formData.position}</span>
            </div>
            <div className="purchase-order-column">
              <span className="label">เรื่อง: </span>
              <span className="value">{formData.subject}</span>
            </div>
          </div>
        </div>

        {/* ตารางสินค้า */}
        <table className="purchase-order-table">
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
        <div className="purchase-order-payment-conditions">
          <div className="purchase-order-payment-option">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินก่อนรับสินค้า"} readOnly />
            <span>ชำระเงินก่อนรับสินค้า</span>
          </div>
          <div className="purchase-order-payment-option">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินหลังได้รับสินค้า"} readOnly />
            <span>ชำระเงินหลังได้รับสินค้า</span>
          </div>
          <div className="purchase-order-payment-option">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินแบบเครดิต"} readOnly />
            <span>ชำระเงินแบบเครดิต</span>
          </div>
          <div className="purchase-order-payment-option">
            <input type="checkbox" checked={formData.paymentConditions === "ชำระเงินเป็นงวดตามสัญญา"} readOnly />
            <span>ชำระเงินเป็นงวดตามสัญญา</span>
          </div>
        </div>

        {/* ลงชื่อ */}
        <div className="purchase-order-signatures">
          <div className="purchase-order-signature">
            <span className="label">ผู้มีอำนาจ</span>
            <br />
            <span className="value">______________________</span>
            <br />
            <div className="date">วันที่ ______________________</div>
          </div>
          <div className="purchase-order-signature">
            <span className="label">ผู้จัดซื้อ</span>
            <br />
            <span className="value">______________________</span>
            <br />
            <div className="date">วันที่ ______________________</div>
          </div>
          <div className="purchase-order-signature">
            <span className="label">ผู้ตรวจสอบ</span>
            <br />
            <span className="value">______________________</span>
            <br />
            <div className="date">วันที่ ______________________</div>
          </div>
        </div>
      </div>

      {/* ปุ่ม PDF ข้างนอกกรอบ */}
      <div className="purchase-order-button-container">
        <button onClick={generatePDF} className="purchase-order-button">บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default PurchaseOrder;
