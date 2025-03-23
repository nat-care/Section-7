import React, { useState } from "react";
import "./DR.css";

const DR = () => {
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
      [name]: e.target.checked, // Updates the checkbox state independently
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };

    // Calculate totalAmount when quantity or unitPrice changes
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

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    alert("ส่งคำขอเรียบร้อย!");
  };

  return (
    <div className="purchase-requisition">
      <h2>ใบรับพัสดุ (Delivery Receipt)</h2>

      {/* Form Section */}
      <div className="row">
        <div className="column">
          <label htmlFor="idPO">ID-PR/NO:</label>
          <input
            type="text"
            id="idPO"
            value={formData.idPO}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="datePO">PR.NO:</label>
          <input
            type="text"
            id="datePO"
            value={formData.datePO}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="datePO">วันที่:</label>
          <input
            type="date"
            id="datePO"
            value={formData.datePO}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="employeePosition">รหัสพนักงาน:</label>
          <input
            type="text"
            id="employeePosition"
            value={formData.employeePosition}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="department">ตำแหน่ง:</label>
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

      <label className="checkbox-label">ตามสินค้า:</label>
      <label>
        <input
          type="checkbox"
          name="purchaseRecord"
          checked={formData.purchaseRecord || false}
          onChange={(e) => handleCheckboxChange("purchaseRecord", e)}
        />
        บันทึกจัดซื้อ/สั่งซื้อ
      </label>

      <label>
        <input
          type="checkbox"
          name="receiveGoods"
          checked={formData.receiveGoods || false}
          onChange={(e) => handleCheckboxChange("receiveGoods", e)}
        />
        รับพัสดุ
      </label>

      <label>
        <input
          type="checkbox"
          name="returnDamagedGoods"
          checked={formData.returnDamagedGoods || false}
          onChange={(e) => handleCheckboxChange("returnDamagedGoods", e)}
        />
        คืนพัสดุเสียหาย
      </label>

      <div className="row">
        <div className="column">
          <label htmlFor="detail">วันที่ครบกำหนด:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="deliveryDate">วันที่ส่งมอบสินค้า:</label>
          <input
            type="text"
            id="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <label className="checkbox-label">ตรวจรับสินค้าตาม:</label>
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="checkGoods"
            checked={formData.checkGoods || false}
            onChange={(e) => handleCheckboxChange("checkGoods", e)}
          />
          ใบส่งของ
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="products"
            checked={formData.products || false}
            onChange={(e) => handleCheckboxChange("products", e)}
          />
          ใบสั่งซื้อ{" "}
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="products"
            checked={formData.products || false}
            onChange={(e) => handleCheckboxChange("products", e)}
          />
          ใบแจ้งชำระหนี้{" "}
        </label>
      </div>
      
&nbsp;
      <div className="received-section">
        <label>ได้รับสินค้าและถือว่า:</label>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" /> ถูกต้อง
          </label>
          <label>
            <input type="checkbox" /> ไม่ถูกต้อง
          </label>
        </div>
        <div className="input-group">
          <label>จำนวนรายการ:</label>
          <input type="number" />
          <label>สินค้าเสียหาย:</label>
          <input type="text" />
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

      <button onClick={addRow} id="addRowBtn">
        เพิ่มแถว
      </button>

      <div className="row">
        <div className="column">
          <label htmlFor="approver">ผู้อนุมัติ:</label>
          <input
            type="text"
            id="approver"
            value={formData.approver}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="approvalDate">วันที่อนุมัติ:</label>
          <input
            type="date"
            id="approvalDate"
            value={formData.approvalDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
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

export default DR;
