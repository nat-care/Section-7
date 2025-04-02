import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./PurchaseOrder.css";
import html2pdf from 'html2pdf.js';

const PurchaseOrder = () => {
  const documentRef = useRef();
  const location = useLocation();
  const [formData, setFormData] = useState({
    idPO: "",
    datePO: "",
    employeeName: "",
    employeePosition: "",
    department: "",
    section: "",
    detail: "",
    approver: "",
    purchaser: "",
    auditor: "",
    dateApproval: "",
    dateApproval2: "",
    dateApproval3: "",
    products: [],
    totalAmount: 0,
    discount: 0,
    vat: 7,
    netAmount: 0,
    payment: "",
    notes: "",
  });
  
  // ฟังก์ชันแปลงรูปแบบวันที่
const formatDate = (date) => {
  if (!date) return ""; // ถ้าไม่มีค่าให้คืน string ว่าง
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date format:", date);
    return ""; 
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

// ใช้ useEffect เพื่อรับค่า location.state.receiptData
useEffect(() => {
  if (location.state?.receiptData) {
    setFormData((prevState) => ({
      ...prevState,
      ...location.state.receiptData,
      products: Array.isArray(location.state.receiptData.products)
        ? location.state.receiptData.products
        : [],
      datePO: formatDate(location.state.receiptData.datePO),
      dateApproval: formatDate(location.state.receiptData.dateApproval),
      dateApproval2: formatDate(location.state.receiptData.dateApproval2),
      dateApproval3: formatDate(location.state.receiptData.dateApproval3),
    }));
  }
}, [location.state]);


  
// ฟังก์ชันสำหรับพิมพ์เป็น PDF (ผ่าน react-to-print)
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: "Purchase Document",
  });

  // ฟังก์ชันสร้าง PDF ด้วย html2pdf

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
              <p>PR.NO:{formData.idPO}</p>
              <p>วันที่:{formData.datePO}</p>
            </div>
          </div>

          <div className="purchase-order-row">
  <div className="purchase-order-column">
    <span className="label">แผนก:</span> <span className="value">{formData.section}</span>
  </div>
  <div className="purchase-order-column">
    <span className="label">ชื่อพนักงาน:</span> <span className="value">{formData.employeeName}</span>
  </div>
  <div className="purchase-order-column">
    <span className="label">ตำแหน่ง:</span> <span className="value">{formData.department}</span>
  </div>
  <div className="purchase-order-column">
    <span className="label">เรื่อง:</span> <span className="value">{formData.detail}</span>
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
            {formData.products.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.item}</td>
                <td>{product.quantity}</td>
                <td>{product.unit}</td>
                <td>{product.totalAmount}</td>
              </tr>
            ))}

            {/* แถวสรุปยอด */}
            <tr>
              <td colSpan="4" className="summary-label">รวมเป็นเงิน:</td>
              <td className="summary-value">{formData.totalAmount}</td>
            </tr>

            <tr>
              <td colSpan="4" className="summary-label">ภาษีมูลค่าเพิ่ม 7%:</td>
              <td className="summary-value">{formData.vat}</td>
            </tr>

            <tr>
              <td colSpan="4" className="summary-label">ส่วนลด:</td>
              <td className="summary-value">{formData.discount}</td>
            </tr>

            <tr>
              <td colSpan="4" className="summary-label">รวมเป็นเงินทั้งสิ้น:</td>
              <td className="summary-value">{formData.netAmount}</td>
            </tr>
          </tbody>
        </table>

        {/* หมายเหตุ */}
        <div className="purchase-order-remark">
          <span className="label">หมายเหตุ:</span>
          <p>{formData.payment}</p>
        </div>

        {/* ลงชื่อ */}
        <div className="purchase-order-signatures">
  <div className="purchase-order-signature">
    <span className="label">ผู้มีอำนาจ</span>
    <span className="value">{formData.approver}</span>
    <div className="date">วันที่ {formData.dateApproval}</div>
  </div>
  
  <div className="purchase-order-signature">
    <span className="label">ผู้จัดซื้อ</span>
    <span className="value">{formData.purchaser}</span>
    <div className="date">วันที่ {formData.dateApproval2}</div>
  </div>
  
  <div className="purchase-order-signature">
    <span className="label">ผู้ตรวจสอบ</span>
    <span className="value">{formData.auditor}</span>
    <div className="date">วันที่ {formData.dateApproval3}</div>
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
