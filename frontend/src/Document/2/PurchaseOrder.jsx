import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2pdf from 'html2pdf.js';
import "./PurchaseOrder.css";

const PurchaseOrder = () => {
  const { id } = useParams(); // ถ้าใช้ /receipt/po/:id route
  const documentRef = useRef();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    date: "",
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

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "";
    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // 🔁 โหลดจาก backend ตาม id ถ้ามี
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const res = await fetch("http://localhost:3000/purchase-orders");
        const data = await res.json();
        const found = data.find((po) => String(po.id) === id);
        if (found) {
          setFormData({
            ...found,
            date: formatDate(found.date),
            dateApproval: formatDate(found.dateApproval),
            dateApproval2: formatDate(found.dateApproval2),
            dateApproval3: formatDate(found.dateApproval3),
          });
        }
      };
      fetchData();
    }
  }, [id]);

  // 🔁 รับค่าจาก state และบันทึกครั้งเดียว
  useEffect(() => {
    const receiptData = location.state?.receiptData;
    if (receiptData) {
      const formatted = {
        ...receiptData,
        id: receiptData.id || Date.now(),
        date: formatDate(receiptData.date),
        dateApproval: formatDate(receiptData.dateApproval),
        dateApproval2: formatDate(receiptData.dateApproval2),
        dateApproval3: formatDate(receiptData.dateApproval3),
        products: Array.isArray(receiptData.products) ? receiptData.products : [],
      };
      setFormData(formatted);

      // 🔁 บันทึกลงฐานข้อมูล
      fetch("http://localhost:3000/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatted),
      })
        .then((res) => {
          if (res.ok) {
            console.log("✅ บันทึก PO เรียบร้อย");
          } else {
            console.error("❌ บันทึก PO ไม่สำเร็จ");
          }
        })
        .catch((err) => {
          console.error("❌ เกิดข้อผิดพลาด:", err);
        });
    }
  }, [location.state]);

  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: "Purchase Order",
  });

  const generatePDF = () => {
    const element = document.getElementById('purchase-order-content');
    const opt = {
      margin: 0.5,
      filename: 'purchase_order.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="purchase-order-page">
      <div id="purchase-order-content" className="purchase-order-container" ref={documentRef}>
        <h2 className="purchase-order-title">ใบสั่งซื้อ</h2>
        <div className="purchase-order-header">
          <div className="header-right">
            <p>PO.ID: {formData.id}</p>
            <p>วันที่: {formData.date}</p>
          </div>
        </div>

        <div className="purchase-order-row">
          <div className="purchase-order-column"><span className="label">แผนก:</span> {formData.section}</div>
          <div className="purchase-order-column"><span className="label">ชื่อพนักงาน:</span> {formData.employeeName}</div>
          <div className="purchase-order-column"><span className="label">ตำแหน่ง:</span> {formData.department}</div>
          <div className="purchase-order-column"><span className="label">เรื่อง:</span> {formData.detail}</div>
        </div>

        <table className="purchase-order-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วย</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.totalAmount}</td>
              </tr>
            ))}
            <tr><td colSpan="4">รวมเป็นเงิน</td><td>{formData.totalAmount}</td></tr>
            <tr><td colSpan="4">ภาษีมูลค่าเพิ่ม 7%</td><td>{formData.vat}</td></tr>
            <tr><td colSpan="4">ส่วนลด</td><td>{formData.discount}</td></tr>
            <tr><td colSpan="4">รวมสุทธิ</td><td>{formData.netAmount}</td></tr>
          </tbody>
        </table>

        <div className="purchase-order-remark">
          <span className="label">หมายเหตุ:</span>
          <p>{formData.payment}</p>
        </div>

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

      <div className="purchase-order-button-container">
        <button onClick={generatePDF} className="purchase-order-button">บันทึกเป็น PDF</button>
      </div>
    </div>
  );
};

export default PurchaseOrder;
