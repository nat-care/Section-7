import React, { useState } from "react";

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
    // Log or save the form data (e.g., to local storage, an API, or a file)
    console.log("Form Data:", formData);
    // Optionally, send the data to a server or store it in a JSON file
    alert("ส่งคำขอเรียบร้อย!");
  };

  return (
    <div className="purchase-requisition">
      <h2>การจัดทำใบสั่งซื้อ (Purchase Order - PO)</h2>

      {/* Form Section */}
      <div className="row">
        <div className="column">
          <label htmlFor="id-pr">ID-PR/NO:</label>
          <input
            type="text"
            id="id-pr"
            value={formData.idPR}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="date-pr">วันที่:</label>
          <input
            type="date"
            id="date-pr"
            value={formData.datePR}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="employee-name">ชื่อพนักงาน:</label>
          <input
            type="text"
            id="employee-name"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="employee-position">ตำแหน่งพนักงาน:</label>
          <input
            type="text"
            id="employee-position"
            value={formData.employeePosition}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="department">ฝ่ายงานที่:</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>
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

      {/* Input fields under the table */}
      <h3>ข้อมูลการชำระเงิน</h3>
      <div className="row">
        <div className="column">
          <label htmlFor="totalAmount">จำนวนเงิน:</label>
          <input
            type="text"
            id="totalAmount"
            value={formData.totalAmount}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="discount">ส่วนลด:</label>
          <input
            type="text"
            id="discount"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="vat">ภาษีมูลค่าเพิ่ม:</label>
          <input
            type="text"
            id="vat"
            value={formData.vat}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="netAmount">รวมเงินทั้งสุทธิ:</label>
          <input
            type="text"
            id="netAmount"
            value={formData.netAmount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="payment">การชำระเงิน:</label>
          <input
            type="text"
            id="payment"
            value={formData.payment}
            onChange={handleInputChange}
          />
        </div>
      </div>

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
    <div className="column">
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
    <div className="column">
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

export default PO;
