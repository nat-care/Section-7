import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./PurchaseRequisition.css";
import html2pdf from "html2pdf.js";

const PurchaseRequisition = () => {
  const documentRef = useRef();
  const location = useLocation();
  const [formData, setFormData] = useState({
    idPR: "",
    datePR: "",
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
    if (location.state?.receiptData) {
      setFormData((prevState) => ({
        ...prevState,
        ...location.state.receiptData,
        products: Array.isArray(location.state.receiptData.products)
          ? location.state.receiptData.products
          : [],
        datePR: location.state.receiptData.datePR
          ? new Date(location.state.receiptData.datePR).toLocaleDateString()
          : "",
        dateApproval: location.state.receiptData.dateApproval
          ? new Date(location.state.receiptData.dateApproval).toLocaleDateString()
          : "",
        dateApproval2: location.state.receiptData.dateApproval2
          ? new Date(location.state.receiptData.dateApproval2).toLocaleDateString()
          : "",
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
    const element = documentRef.current;
    const opt = {
      margin: 0.5,
      filename: "purchase_document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="purchase-requisition-container">
      {/* เอกสารใบจัดซื้อ */}
      <div className="purchase-requisition-document" ref={documentRef}>
        <h2 style={{ textAlign: "center", marginTop: "0" }}>ใบจัดขอจัดซื้อ</h2>

        {/* ส่วนหัวของเอกสาร */}
        <div className="purchase-requisition-header">
          <div className="header-right">
            <p>PR.NO: {formData.idPR}</p>
            <p>วันที่: {formData.datePR}</p>
          </div>
        </div>

        {/* ส่วนรายละเอียด */}
        <div className="purchase-requisition-section">
          <p>ชื่อผู้ขอซื้อ: {formData.employeeName}</p>
          <p>แผนก: {formData.section} ตำแหน่ง: {formData.department}</p>
          <p>เรื่อง: {formData.detail}</p>
        </div>

        {/* ตารางรายการสินค้า */}
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
            {formData.products?.length > 0 ? (
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

        {/* หมายเหตุ */}
        <div className="purchase-requisition-section">
          <p>หมายเหตุ: {formData.remark}</p>
        </div>

        {/* ลายเซ็น */}
        <div className="purchase-requisition-signature">
          <div className="signature-block">
            <p>ผู้อนุมัติฝ่ายจัดซื้อ</p>
            <div className="signature-line">{formData.approver}</div>
            <p>วันที่: {formData.dateApproval}</p>
          </div>
          <div className="signature-block">
            <p>เจ้าหน้าที่ฝ่ายจัดซื้อ</p>
            <div className="signature-line">{formData.staff}</div>
            <p>วันที่: {formData.dateApproval2}</p>
          </div>
        </div>
      </div>

      {/* ปุ่มพิมพ์เป็น PDF (นอกกรอบของเอกสาร) */}
      <div className="purchase-requisition-pdf-button-container">
        <button onClick={generatePDF} className="purchase-requisition-pdf-button">
          บันทึกเป็น PDF
        </button>
      </div>
    </div>
  );
};

export default PurchaseRequisition;
