import React, { useState } from "react";
import "./PO.css";

const PO = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const [formData, setFormData] = useState({
    idPO: "",
    datePO: "",
    employeeName: "",
    employeePosition: "",
    department: "",
    section: "",
    detail: "",
    products: [],
    totalAmount: "",
    discount: "",
    vat: "",
    netAmount: "",
    payment: "",
    notes: "",
  });

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const handleSubmit = () => {
    // Send the form data to the server via POST request
    fetch("http://localhost:3000/purchase-requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Form Data Submitted:", data);
        alert("ส่งคำขอเรียบร้อย!");
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการส่งคำขอ");
    });
  };

  return (
    <div className="po-purchase-requisition">
      <h2>การจัดทำใบสั่งซื้อ (Purchase Order - PO)</h2>

      {/* Form Section */}
      <div className="po-row">
        <div className="po-column">
          <label htmlFor="id-po">ID-PO/NO:</label>
          <input
            type="text"
            id="id-po"
            value={formData.idPO}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="date-po">วันที่:</label>
          <input
            type="date"
            id="date-po"
            value={formData.datePO}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="employee-name">ชื่อพนักงาน:</label>
          <input
            type="text"
            id="employee-name"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="employee-position">ตำแหน่งพนักงาน:</label>
          <input
            type="text"
            id="employee-position"
            value={formData.employeePosition}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="department">ฝ่ายงานที่:</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="section">แผนก:</label>
          <input
            type="text"
            id="section"
            value={formData.section}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="detail">เรื่องรายละเอียด:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3>โปรดกรอกข้อมูลสินค้า</h3>
      <table id="po-productTable">
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
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row}</td>
              <td>
                <input
                  type="text"
                  name="item"
                  value={formData.products[index]?.item || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={formData.products[index]?.quantity || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  value={formData.products[index]?.unit || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.products[index]?.unitPrice || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.products[index]?.totalAmount || ""}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row Button */}
      <button onClick={addRow} id="po-addRowBtn">
        เพิ่มแถว
      </button>

      {/* Input fields under the table */}
      <h3>ข้อมูลการชำระเงิน</h3>
      <div className="po-row">
        <div className="po-column">
          <label htmlFor="totalAmount">จำนวนเงิน:</label>
          <input
            type="text"
            id="totalAmount"
            value={formData.totalAmount}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="discount">ส่วนลด:</label>
          <input
            type="text"
            id="discount"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="vat">ภาษีมูลค่าเพิ่ม:</label>
          <input
            type="text"
            id="vat"
            value={formData.vat}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="netAmount">รวมเงินทั้งสุทธิ:</label>
          <input
            type="text"
            id="netAmount"
            value={formData.netAmount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="payment">การชำระเงิน:</label>
          <input
            type="text"
            id="payment"
            value={formData.payment}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="notes">หมายเหตุ:</label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="approver">ผู้มีอำนาจ:</label>
          <input
            type="text"
            id="approver"
            value={formData.approver}
            onChange={handleInputChange}
          />
          <label htmlFor="date-approver">วันที่:</label>
          <input
            type="date"
            id="date-approver"
            value={formData.dateApprover}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="staff">ผู้จัดซื้อ:</label>
          <input
            type="text"
            id="staff"
            value={formData.staff}
            onChange={handleInputChange}
          />
          <label htmlFor="date-staff">วันที่:</label>
          <input
            type="date"
            id="date-staff"
            value={formData.dateStaff}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="auditor">ผู้ตรวจสอบ:</label>
          <input
            type="text"
            id="auditor"
            value={formData.auditor}
            onChange={handleInputChange}
          />
          <label htmlFor="date-auditor">วันที่:</label>
          <input
            type="date"
            id="date-auditor"
            value={formData.dateAuditor}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Action Buttons (แก้ไขคำขอ and ส่งคำขอ) */}
      <div className="po-buttons">
        <button type="button" id="editRequestBtn">
          แก้ไขคำขอ
        </button>
        <button type="button" id="submitRequestBtn" onClick={handleSubmit}>
          ส่งคำขอ
        </button>
      </div>
    </div>
  );
};

export default PO;
