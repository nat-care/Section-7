import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import "./PurchaseRequisition.css";

const PurchaseRequisition = () => {
  const { id } = useParams();
  const documentRef = useRef();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    date: "",
    employeeName: "",
    employeePosition: "",
    department: "",
    section: "",
    detail: "",
    remark: "",
    approver: "",
    staff: "",
    dateApproval: "",
    dateApproval2: "",
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/purchase-requests");
      const data = await res.json();
      const found = data.find((doc) => String(doc.id) === id);
      if (found) {
        setFormData({
          ...found,
          products: Array.isArray(found.products) ? found.products : [],
        });
      }
    };
  
    fetchData();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: "Purchase Requisition",
  });

  const generatePDF = () => {
    const element = documentRef.current;
    const opt = {
      margin: 0.5,
      filename: "purchase_requisition.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="purchase-requisition-container">
      <div className="purchase-requisition-document" ref={documentRef}>
        <h2 style={{ textAlign: "center", marginTop: "0" }}>ใบขอจัดซื้อสินค้า</h2>

        <div className="purchase-requisition-header">
          <div className="header-right">
            <p>PR.NO: {formData.name}</p>
            <p>วันที่: {formatDate(formData.date)}</p>
          </div>
        </div>

        <div className="purchase-requisition-section">
          <p>ชื่อผู้ขอซื้อ: {formData.employeeName}</p>
          <p>แผนก: {formData.section} ตำแหน่ง: {formData.department}</p>
          <p>เรื่อง: {formData.detail}</p>
        </div>

        <table className="purchase-requisition-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วย</th>
              <th>ราคาต่อหน่วย</th>
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.length > 0 ? (
              formData.products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>ไม่มีรายการสินค้า</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="purchase-requisition-section">
          <p>หมายเหตุ: {formData.remark}</p>
        </div>

        <div className="purchase-requisition-signature">
          <div className="signature-block">
            <p>ผู้อนุมัติฝ่ายจัดซื้อ</p>
            <div className="signature-line">{formData.approver}</div>
            <p>วันที่: {formatDate(formData.dateApproval)}</p>
          </div>
          <div className="signature-block">
            <p>เจ้าหน้าที่ฝ่ายจัดซื้อ</p>
            <div className="signature-line">{formData.staff}</div>
            <p>วันที่: {formatDate(formData.dateApproval2)}</p>
          </div>
        </div>
      </div>

      <div className="purchase-requisition-pdf-button-container">
        <button onClick={generatePDF} className="purchase-requisition-pdf-button">
          บันทึกเป็น PDF
        </button>
      </div>
    </div>
  );
};

export default PurchaseRequisition;
