import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DR.css";

const DR = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idDR: "",
    drNo: "", // DR No.
    dateDR: "", // Date
    employeePosition: "", // Employee Position
    EmployeeID: "",
    department: "", // Department
    products: [], // Array of product objects
    goodsDetails: "", // ตามสินค้า
    dueDate: "", // วันที่ครบกำหนด
    deliveryDate: "", // วันที่ส่งมอบสินค้า
    checkGoodsDetail: "", // ตรวจรับสินค้าตาม
    receiveGoodsDate: "", // ได้รับสินค้า
    additionalDetails: "", // เรื่องรายละเอียด
    remarks: "", // หมายเหตุ
    sender: "", // ผู้ส่งพัสดุ
    receiver: "", //  ผู้รับพัสดุ
    approvalDate: "", // วันที่อนุมัติ
    approvalDate2: "", // วันที่อนุมัติ (ผู้รับพัสดุ)
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
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };

    // ค้นหาข้อมูลสินค้าจากฐานข้อมูล products ที่ดึงมา
    const selectedProduct = products.find(p => p.name === updatedProducts[index].item);

    if (selectedProduct) {
      updatedProducts[index].unit = selectedProduct.unit || ''; // ตั้งค่าหน่วยนับจากข้อมูลสินค้า
      updatedProducts[index].unitPrice = selectedProduct.price || ''; // ตั้งค่าราคาต่อหน่วยจากข้อมูลสินค้า
    }

    // คำนวณ totalAmount
    if (updatedProducts[index].unitPrice && updatedProducts[index].quantity) {
      updatedProducts[index].totalAmount = (
        parseFloat(updatedProducts[index].unitPrice) * parseFloat(updatedProducts[index].quantity)
      ).toFixed(2);
    } else {
      updatedProducts[index].totalAmount = '';
    }

    setFormData(prevData => ({
      ...prevData,
      products: updatedProducts
    }));
  };
  const handleSubmit = () => {
    console.log(formData); // Log the form data for debugging

    // Your existing validation logic
    if (
      !formData.idDR ||
      !formData.dateDR ||
      !formData.products.length ||
      formData.products.some(
        (product) =>
          !product.item || !product.quantity || !product.unit || !product.unitPrice
      )
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    fetch("http://localhost:3000/delivery-receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Form Data Submitted:", data);
        alert("ส่งข้อมูลเรียบร้อย!");
        navigate("/delivery-receipts", { state: { receiptData: formData } });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
      });
  };

  return (
    <div className="DR-page">
      <h2 className="DR-title">ใบรับพัสดุ (Delivery Receipt)</h2>

      {/* Form Section */}
      <div className="DR-form-row">
        <div className="DR-form-column">
          <label htmlFor="idDR">ID-DR/NO:</label>
          <input
            type="text"
            id="idDR"
            value={formData.idDR}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
        <div className="DR-form-column">
          <label htmlFor="drNo">DR.NO:</label>
          <input
            type="text"
            id="drNo"
            value={formData.drNo}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
      </div>

      <div className="DR-form-row">
        <div className="DR-form-column">
          <label htmlFor="dateDR">วันที่:</label>
          <input
            type="date"
            id="dateDR"
            value={formData.dateDR}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
        <div className="DR-form-column">
          <label htmlFor="EmployeeID">รหัสพนักงาน:</label>
          <input
            type="text"
            id="EmployeeID"
            value={formData.EmployeeID}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
      </div>

      <div className="DR-form-row">
        <div className="DR-form-column">
          <label htmlFor="employeePosition">ตำแหน่ง</label>
          <input
            type="text"
            id="employeePosition"
            value={formData.employeePosition}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
        <div className="DR-form-column">
          <label htmlFor="department">แผนก</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
      </div>

      {/* Other sections */}
      <div className="DR-text-group">
        <label htmlFor="goodsDetails">ตามสินค้า:</label>
        <input
          type="text"
          id="goodsDetails"
          value={formData.goodsDetails}
          onChange={handleInputChange}
          className="DR-text-input"
        />
        <label htmlFor="dueDate">วันที่ครบกำหนด:</label>
        <input
          type="date"
          id="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className="DR-text-input"
        />
        <label htmlFor="deliveryDate">วันที่ส่งมอบสินค้า:</label>
        <input
          type="date"
          id="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleInputChange}
          className="DR-text-input"
        />
        <label htmlFor="checkGoodsDetail">ตรวจรับสินค้าตาม:</label>
        <input
          type="text"
          id="checkGoodsDetail"
          value={formData.checkGoodsDetail}
          onChange={handleInputChange}
          className="DR-text-input"
        />
        <label htmlFor="receiveGoodsDate">ได้รับสินค้า:</label>
        <input
          type="date"
          id="receiveGoodsDate"
          value={formData.receiveGoodsDate}
          onChange={handleInputChange}
          className="DR-text-input"
        />
        <label htmlFor="additionalDetails">เรื่องรายละเอียด:</label>
        <input
          type="text"
          id="additionalDetails"
          value={formData.additionalDetails}
          onChange={handleInputChange}
          className="DR-text-input"
        />
      </div>

      {/* Product Table */}
      <h3 className="DR-product-title">โปรดกรอกข้อมูลสินค้า</h3>
      <table id="productTable" className="DR-product-table">
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
                  id={`product-item-${index}`} // Added unique ID for better accessibility
                  value={formData.products[index]?.item || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="DR-product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  id={`product-quantity-${index}`} // Added unique ID for better accessibility
                  value={formData.products[index]?.quantity || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="DR-product-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  id={`product-unit-${index}`} // Added unique ID for better accessibility
                  value={formData.products[index]?.unit || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="DR-product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  id={`product-unitPrice-${index}`} // Added unique ID for better accessibility
                  value={formData.products[index]?.unitPrice || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="DR-product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  id={`product-totalAmount-${index}`} // Added unique ID for better accessibility
                  value={formData.products[index]?.totalAmount || ""}
                  readOnly
                  className="DR-product-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} className="DR-add-row-btn">
        เพิ่มแถว
      </button>

      {/* Remarks and Approval */}
      <div className="DR-form-row">
        <div className="DR-form-column">
          <label htmlFor="remarks">หมายเหตุ:</label>
          <input
            type="text"
            id="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
      </div>

      <div className="DR-form-row">
        <div className="DR-form-column">
          <label htmlFor="sender">ผู้ส่งพัสดุ:</label>
          <input
            type="text"
            id="sender"
            value={formData.approver}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
        <div className="DR-form-column">
          <label htmlFor="approvalDate">วันที่อนุมัติ:</label>
          <input
            type="date"
            id="approvalDate"
            value={formData.approvalDate}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
      </div>

      <div className="DR-form-row">
        <div className="DR-form-column">
          <label htmlFor="receiver">ผู้รับพัสดุ:</label>
          <input
            type="text"
            id="receiver"
            value={formData.receiver}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
        <div className="DR-form-column">
          <label htmlFor="approvalDate2">วันที่อนุมัติ:</label>
          <input
            type="date"
            id="approvalDate2"
            value={formData.approvalDate2}
            onChange={handleInputChange}
            className="DR-form-input"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} className="DR-submit-btn">
        บันทึกข้อมูล
      </button>
    </div>
  );
};

export default DR;
