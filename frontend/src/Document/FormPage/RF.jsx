import React, { useState } from "react";

const RF = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const [formData, setFormData] = useState({
    idPO: "",
    datePO: "",
    employeeName: "",
    employeeId: "", // Added employeeId
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
    approver: "", // Added approver
    staff: "", // Added staff
    dateApproval: "", // Added dateApproval
    dateApproval2: "", // Added dateApproval2
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

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/invoice", {
        method: "POST", // or "PUT" depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Assuming the response is JSON
        console.log("Form Data sent to the server successfully:", responseData);
        alert("ส่งคำขอเรียบร้อย!");
      } else {
        const errorData = await response.json(); // Handle error messages from server
        console.error("Error sending form data:", errorData);
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("มีข้อผิดพลาดในการส่งข้อมูล!");
    }
  };

  return (
    <div className="purchase-requisition">
      <h2>ใบรับเบิก (Requisition Form)</h2>

      {/* Form Section */}
      <div className="row">
        <div className="column">
          <label htmlFor="id-po">ID-PO/NO:</label>
          <input
            type="text"
            id="id-po"
            value={formData.idPO}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="date-po">วันที่:</label>
          <input
            type="date"
            id="date-po"
            value={formData.datePO}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="employee-name">ชื่อของผู้ขอเบิก:</label>
          <input
            type="text"
            id="employee-name"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="employee-id">รหัสพนักงาน:</label>
          <input
            type="text"
            id="employee-id"
            value={formData.employeeId}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="employee-position">ตำแหน่ง:</label>
          <input
            type="text"
            id="employee-position"
            value={formData.employeePosition}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="department">แผนก:</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="section">แผนก:</label>
          <input
            type="text"
            id="section"
            value={formData.section}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="detail">เหตุผลในการขอเบิก:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3>โปรดกรอกข้อมูลสินค้า</h3>
      <table id="productTable">
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
      <button onClick={addRow} id="addRowBtn">
        เพิ่มแถว
      </button>

      <div className="row">
        <div className="column">
          <label htmlFor="notes">หมายเหตุ:</label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="approver">ผู้ขอเบิก:</label>
          <input
            type="text"
            id="approver"
            value={formData.approver}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="approver-staff">หัวหน้าฝ่าย / ผู้อนุมัติ:</label>
          <input
            type="text"
            id="approver-staff"
            value={formData.staff}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="inventory-staff">เจ้าหน้าที่คลัง :</label>
          <input
            type="text"
            id="inventory-staff"
            value={formData.staff}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="date-approval">วันที่:</label>
          <input
            type="date"
            id="date-approval"
            value={formData.dateApproval}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="date-approval2">วันที่:</label>
          <input
            type="date"
            id="date-approval2"
            value={formData.dateApproval2}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Action Buttons (แก้ไขคำขอ and ส่งคำขอ) */}
      <div className="buttons">
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

export default RF;
