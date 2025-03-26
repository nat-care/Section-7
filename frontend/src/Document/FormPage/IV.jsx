import React, { useState } from "react";

const IV = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const [formData, setFormData] = useState({
    idIV: "", // Changed to idIV
    dateIV: "", // Changed to dateIV
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
        console.log("Form Data sent to the server successfully.");
        alert("ส่งคำขอเรียบร้อย!");
      } else {
        console.error("Error sending form data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="purchase-requisition">
      <h2>ใบแจ้งหนี้ (Invoice)</h2>

      {/* Form Section */}
      <label htmlFor="">ผู้ส่งใบแจ้งหนี้</label>
      <div className="row">
        <div className="column">
          <label htmlFor="id-IV">รหัสอ้างอิง</label>
          <input
            type="text"
            id="id-IV" // Changed id to id-IV
            value={formData.idIV}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="companyName">ชื่อบริษัท</label>
          <input
            type="text"
            id="companyName" // Changed id to companyName
            value={formData.companyName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="companyAddress">ที่อยู่ของบริษัท</label>
          <input
            type="text"
            id="companyAddress" // Changed id to companyAddress
            value={formData.companyAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="employee-position">อีเมล:</label>
          <input
            type="text"
            id="employee-position"
            value={formData.employeePosition}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <label htmlFor="">ชำระเงินหนี้</label>

      <div className="row">
        <div className="column">
          <label htmlFor="department">รหัสอ้างอิง:</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="section">ชื่อบริษัทที่ต้องชำระเงิน:</label>
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
          <label htmlFor="detail">ที่อยู่ของบริษัท:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>

        <div className="column">
          <label htmlFor="section">อีเมล:</label>
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
          <label htmlFor="taxID">Tax ID:</label> {/* Changed detail to taxID */}
          <input
            type="text"
            id="taxID" // Changed detail to taxID
            value={formData.taxID} // Changed to taxID
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

      <div className="row">
        <div className="column">
          <label htmlFor="totalAmount">จำนวนเงิน:</label> {/* Changed detail to totalAmount */}
          <input
            type="text"
            id="totalAmount" // Changed detail to totalAmount
            value={formData.totalAmount} // Changed to totalAmount
            onChange={handleInputChange}
          />
        </div>

        <div className="column">
          <label htmlFor="discount">ส่วนลด:</label>
          <input
            type="text"
            id="discount" // Changed section to discount
            value={formData.discount} // Changed to discount
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="vat">ภาษีมูลค่าเพิ่ม :</label> {/* Changed detail to vat */}
          <input
            type="text"
            id="vat" // Changed detail to vat
            value={formData.vat} // Changed to vat
            onChange={handleInputChange}
          />
        </div>

        <div className="column">
          <label htmlFor="netAmount">รวมเงินทั้งสุทธิ:</label> {/* Changed section to netAmount */}
          <input
            type="text"
            id="netAmount" // Changed section to netAmount
            value={formData.netAmount} // Changed to netAmount
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
          <label htmlFor="penalty">ค่าปรับหรือดอกเบี้ยในกรณีชำระล่าช้า:</label> {/* Changed notes to penalty */}
          <input
            type="text"
            id="penalty" // Changed notes to penalty
            value={formData.penalty} // Changed to penalty
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="approver">ผู้มีอำนาจออกใบแจ้งหนี้:</label>
          <input
            type="text"
            id="approver"
            value={formData.approver}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="staff">ตราประทับบริษัท:</label>
          <input
            type="text"
            id="staff"
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

export default IV;
