import React, { useState } from "react";
import "./RF.css";

const RF = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const [formData, setFormData] = useState({
    idRF: "", 
    dateRF: "", 
    employeeName: "",
    employeeId: "", 
    senderName: "",
    detail: "",
    products: [],
    totalAmount: "",
    notes: "",
    approver: "",
    approverStaff: "",
    inventoryStaff: "",
    dateApproval: "",
    dateApproval2: "",
    dateApproval3: "",
  });

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        { item: "", quantity: "", unit: "", unitPrice: "", totalAmount: "" },
      ],
    }));
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
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value,
    };
    // Calculate totalAmount when quantity or unitPrice changes
    if (name === "quantity" || name === "unitPrice") {
      updatedProducts[index].totalAmount = (
        (updatedProducts[index].quantity || 0) *
        (updatedProducts[index].unitPrice || 0)
      ).toFixed(2); // Ensure the value is formatted to 2 decimal places
    }
    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const handleSubmit = () => {
    if (!formData.idRF || !formData.dateRF || !formData.employeeName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    // Send the form data to the server via POST request
    fetch("http://localhost:3000/requisitions", {
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
    <div className="requisition-form">
      <h2 className="requisition-form__title">ใบรับเบิก (Requisition Form)</h2>

      {/* Form Section */}
      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label htmlFor="idRF" className="requisition-form__label">
            ID-RF/NO:
          </label>
          <input
            type="text"
            id="idRF"
            value={formData.idRF}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
        <div className="requisition-form__column">
          <label htmlFor="dateRF" className="requisition-form__label">
            วันที่:
          </label>
          <input
            type="date"
            id="dateRF"
            value={formData.dateRF}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
      </div>

      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label htmlFor="employeeName" className="requisition-form__label">
            ชื่อของผู้ขอเบิก:
          </label>
          <input
            type="text"
            id="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
        <div className="requisition-form__column">
          <label htmlFor="employeeId" className="requisition-form__label">
            รหัสพนักงาน:
          </label>
          <input
            type="text"
            id="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
      </div>

      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label
            htmlFor="senderName"
            className="requisition-form__label"
          >
            ชื่อผู้ส่ง:
          </label>
          <input
            type="text"
            id="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
       
      </div>

     

      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label htmlFor="detail" className="requisition-form__label">
            เหตุผลในการขอเบิก:
          </label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
      </div>

      <h3 className="requisition-form__section-title">โปรดกรอกข้อมูลสินค้า</h3>
      <table className="requisition-form__table">
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
                  className="requisition-form__product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={formData.products[index]?.quantity || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="requisition-form__product-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  value={formData.products[index]?.unit || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="requisition-form__product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.products[index]?.unitPrice || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="requisition-form__product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.products[index]?.totalAmount || ""}
                  readOnly
                  className="requisition-form__product-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row Button */}
      <button
        onClick={addRow}
        className="requisition-form__button"
        id="addRowBtn"
      >
        เพิ่มแถว
      </button>

      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label htmlFor="notes" className="requisition-form__label">
            หมายเหตุ:
          </label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
      </div>

      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label htmlFor="approver" className="requisition-form__label">
            ผู้ขอเบิก:
          </label>
          <input
            type="text"
            id="approver"
            value={formData.approver}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
        <div className="requisition-form__column">
          <label htmlFor="approverStaff" className="requisition-form__label">
            หัวหน้าฝ่าย / ผู้อนุมัติ:
          </label>
          <input
            type="text"
            id="approverStaff"
            value={formData.approverStaff}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
        <div className="requisition-form__column">
          <label htmlFor="inventoryStaff" className="requisition-form__label">
            เจ้าหน้าที่คลัง :
          </label>
          <input
            type="text"
            id="inventoryStaff"
            value={formData.inventoryStaff}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
      </div>

      <div className="requisition-form__row">
        <div className="requisition-form__column">
          <label htmlFor="dateApproval" className="requisition-form__input-label">วันที่:</label>
          <input
            type="date"
            id="dateApproval"
            value={formData.dateApproval}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
        <div className="requisition-form__column">
          <label htmlFor="dateApproval2" className="requisition-form__input-label">วันที่:</label>
          <input
            type="date"
            id="dateApproval2"
            value={formData.dateApproval2}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
        <div className="requisition-form__column">
          <label htmlFor="dateApproval3" className="requisition-form__input-label">วันที่:</label>
          <input
            type="date"
            id="dateApproval3"
            value={formData.dateApproval3}
            onChange={handleInputChange}
            className="requisition-form__input"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} className="requisition-form__submit-btn">
        ส่งข้อมูล
      </button>
    </div>
  );
};

export default RF;
