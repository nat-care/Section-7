import React, { useState } from "react";

const DR = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const [formData, setFormData] = useState({
    idDR: "",
    dateDR: "",
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
    purchaseRecord: false,
    receiveGoods: false,
    returnDamagedGoods: false,
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

  const handleCheckboxChange = (name, e) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target.checked,
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };

    if (name === "quantity" || name === "unitPrice") {
      const quantity = parseFloat(updatedProducts[index]?.quantity) || 0;
      const unitPrice = parseFloat(updatedProducts[index]?.unitPrice) || 0;
      updatedProducts[index].totalAmount = (quantity * unitPrice).toFixed(2);
    }

    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/saveDR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="delivery-receipt-page">
      <h2 className="delivery-receipt-title">ใบรับพัสดุ (Delivery Receipt)</h2>

      {/* Form Section */}
      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="idDR">ID-DR/NO:</label>
          <input
            type="text"
            id="idDR"
            value={formData.idDR}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
        <div className="delivery-receipt-form-column">
          <label htmlFor="dateDR">DR.NO:</label>
          <input
            type="text"
            id="dateDR"
            value={formData.dateDR}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>

      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="dateDR">วันที่:</label>
          <input
            type="date"
            id="dateDR"
            value={formData.dateDR}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
        <div className="delivery-receipt-form-column">
          <label htmlFor="employeePosition">รหัสพนักงาน:</label>
          <input
            type="text"
            id="employeePosition"
            value={formData.employeePosition}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>

      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="department">ตำแหน่ง:</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
        <div className="delivery-receipt-form-column">
          <label htmlFor="section">แผนก:</label>
          <input
            type="text"
            id="section"
            value={formData.section}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>

      <label className="delivery-receipt-checkbox-label">ตามสินค้า:</label>
      <div className="delivery-receipt-checkbox-group">
        <label>
          <input
            type="checkbox"
            name="purchaseRecord"
            checked={formData.purchaseRecord || false}
            onChange={(e) => handleCheckboxChange("purchaseRecord", e)}
            className="delivery-receipt-checkbox-input"
          />
          บันทึกจัดซื้อ/สั่งซื้อ
        </label>
        <label>
          <input
            type="checkbox"
            name="receiveGoods"
            checked={formData.receiveGoods || false}
            onChange={(e) => handleCheckboxChange("receiveGoods", e)}
            className="delivery-receipt-checkbox-input"
          />
          รับพัสดุ
        </label>
        <label>
          <input
            type="checkbox"
            name="returnDamagedGoods"
            checked={formData.returnDamagedGoods || false}
            onChange={(e) => handleCheckboxChange("returnDamagedGoods", e)}
            className="delivery-receipt-checkbox-input"
          />
          คืนพัสดุเสียหาย
        </label>
      </div>

      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="detail">วันที่ครบกำหนด:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>

      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="deliveryDate">วันที่ส่งมอบสินค้า:</label>
          <input
            type="text"
            id="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>

      <label className="delivery-receipt-checkbox-label">ตรวจรับสินค้าตาม:</label>
      <div className="delivery-receipt-checkbox-group">
        <label>
          <input
            type="checkbox"
            name="checkGoods"
            checked={formData.checkGoods || false}
            onChange={(e) => handleCheckboxChange("checkGoods", e)}
            className="delivery-receipt-checkbox-input"
          />
          ใบส่งของ
        </label>
        <label>
          <input
            type="checkbox"
            name="products"
            checked={formData.products || false}
            onChange={(e) => handleCheckboxChange("products", e)}
            className="delivery-receipt-checkbox-input"
          />
          ใบสั่งซื้อ
        </label>
        <label>
          <input
            type="checkbox"
            name="products"
            checked={formData.products || false}
            onChange={(e) => handleCheckboxChange("products", e)}
            className="delivery-receipt-checkbox-input"
          />
          ใบแจ้งชำระหนี้
        </label>
      </div>

      <div className="delivery-receipt-received-section">
        <label>ได้รับสินค้าและถือว่า:</label>
        <div className="delivery-receipt-checkbox-group">
          <label>
            <input type="checkbox" className="delivery-receipt-checkbox-input" /> ถูกต้อง
          </label>
          <label>
            <input type="checkbox" className="delivery-receipt-checkbox-input" /> ไม่ถูกต้อง
          </label>
        </div>
        <div className="delivery-receipt-input-group">
          <label>จำนวนรายการ:</label>
          <input type="number" className="delivery-receipt-form-input" />
          <label>สินค้าเสียหาย:</label>
          <input type="text" className="delivery-receipt-form-input" />
        </div>
      </div>

      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="notes">หมายเหตุ:</label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>

      <h3 className="delivery-receipt-product-title">โปรดกรอกข้อมูลสินค้า</h3>
      <table id="productTable" className="delivery-receipt-product-table">
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
                  className="delivery-receipt-product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={formData.products[index]?.quantity || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="delivery-receipt-product-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  value={formData.products[index]?.unit || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="delivery-receipt-product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.products[index]?.unitPrice || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="delivery-receipt-product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.products[index]?.totalAmount || ""}
                  readOnly
                  className="delivery-receipt-product-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} className="delivery-receipt-add-row-btn">
        เพิ่มแถว
      </button>

      <div className="delivery-receipt-form-row">
        <div className="delivery-receipt-form-column">
          <label htmlFor="approver">ผู้อนุมัติ:</label>
          <input
            type="text"
            id="approver"
            value={formData.approver}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
        <div className="delivery-receipt-form-column">
          <label htmlFor="approvalDate">วันที่อนุมัติ:</label>
          <input
            type="date"
            id="approvalDate"
            value={formData.approvalDate}
            onChange={handleInputChange}
            className="delivery-receipt-form-input"
          />
        </div>
      </div>
      
      <div className="delivery-receipt-buttons">
        <button type="button" className="delivery-receipt-edit-request-btn">
          แก้ไขคำขอ
        </button>
        <button type="button" className="delivery-receipt-submit-request-btn" onClick={handleSubmit}>
          ส่งคำขอ
        </button>
      </div>
    </div>
  );
};

export default DR;
