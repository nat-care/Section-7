import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./RequisitionForm.css";
import html2pdf from "html2pdf.js";

const RequisitionForm = () => {
  const formRef = useRef();
  const location = useLocation();
  const [formData, setFormData] = useState({
    idRF: "",
    dateRF: "",
    employeeName: "",
    employeeId: "",
    senderName: "",
    detail: "",
    products: [],
    notes: "",
    approver: "",
    approverStaff: "",
    inventoryStaff: "",
    dateApproval: "",
    dateApproval2: "",
    dateApproval3: "",
  });

  useEffect(() => {
    if (location.state && location.state.receiptData) {
      setFormData(location.state.receiptData);
    }
  }, [location.state]);

  const generatePDF = () => {
    html2pdf().from(formRef.current).save("RequisitionForm.pdf");
  };

  return (
    <div className="requisition-page-wrapper">
      <div className="requisition-form-container" ref={formRef}>
        <h2 className="requisition-title">ใบรับเบิก</h2>

        <div className="requisition-info-section">
          <div className="requisition-right-align">
            <div className="requisition-rowNO">
              <span className="requisition-label">RP.NO:</span>
              <span className="requisition-value">{formData.idRF}</span>
            </div>
            <div className="requisition-rowData">
              <span className="requisition-label">วันที่:</span>
              <span className="requisition-value">{formData.dateRF}</span>
            </div>
          </div>

          <div className="requisition-rowName">
            <span className="requisition-label">ชื่อผู้เบิก:</span>
            <span className="requisition-value">{formData.employeeName}</span>
          </div>
          <div className="requisition-rownumber">
            <span className="requisition-label">รหัสพนักงาน:</span>
            <span className="requisition-value">{formData.employeeId}</span>
          </div>
          <div className="requisition-rowNameS">
            <span className="requisition-label">ชื่อผู้ส่ง:</span>
            <span className="requisition-value">{formData.senderName}</span>
          </div>
          <div className="requisition-rowway">
            <span className="requisition-label">เหตุผลการเบิก:</span>
            <span className="requisition-value">{formData.notes}</span>
          </div>
        </div>

        <h3 className="requisition-item-header">รายการที่ขอเบิก</h3>
        <table className="requisition-table">
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
            {formData.products?.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.item}</td>
                <td>{product.quantity}</td>
                <td>{product.unit}</td>
                <td>{product.unitPrice}</td>
                <td>{product.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="requisition-remarks-section">
          <span className="requisition-label">หมายเหตุ:</span>
          <span className="requisition-value">{formData.notes}</span>
        </div>

        <div className="requisition-signatures">
          <div className="requisition-signature-block">
            <span className="requisition-label">ผู้ขอเบิก</span>
            <br />
            <span className="requisition-value">
              {formData.approver || "______________________"}
            </span>
            <br />
            <span className="requisition-label">วันที่</span>
            <span className="requisition-value">{formData.dateApproval}</span>
          </div>
          <div className="requisition-signature-block">
            <span className="requisition-label">หัวหน้าฝ่าย / ผู้อนุมัติ</span>
            <br />
            <span className="requisition-value">
              {formData.approverStaff || "______________________"}
            </span>
            <br />
            <span className="requisition-label">วันที่</span>
            <span className="requisition-value">{formData.dateApproval2}</span>
          </div>
          <div className="requisition-signature-block">
            <span className="requisition-label">เจ้าหน้าที่คลัง</span>
            <br />
            <span className="requisition-value">
              {formData.inventoryStaff || "______________________"}
            </span>
            <br />
            <span className="requisition-label">วันที่</span>
            <span className="requisition-value">{formData.dateApproval3}</span>
          </div>
        </div>
      </div>

      <div className="requisition-pdf-button-container">
        <button className="requisition-pdf-button" onClick={generatePDF}>
          บันทึกเป็น PDF
        </button>
      </div>
    </div>
  );
};

export default RequisitionForm;
