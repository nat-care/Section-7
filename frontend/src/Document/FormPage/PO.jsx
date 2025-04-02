import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // เพิ่มการ import
import "react-datepicker/dist/react-datepicker.css"; // เพิ่มการ import สไตล์
import "./PO.css";

const PO = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([1]); // เริ่มต้น 1 แถว
  const [formData, setFormData] = useState({
    idPO: "",
    datePO: "", 
    employeeName: "",
    employeePosition: "",
    department: "",
    section: "",
    detail: "",
    approver: "",
    purchaser: "",
    auditor: "",
    dateApproval: "", 
    dateApproval2: "",
    dateApproval3: "",
    products: [
      { item: "", quantity: 0, unit: "", unitPrice: 0, totalAmount: 0 },
    ],
    totalAmount: 0,
    discount: 0,
    vat: 7,
    netAmount: 0,
    payment: "",
    notes: "",
  });
  

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        { item: "", quantity: 0, unit: "", unitPrice: 0, totalAmount: 0 },
      ],
    }));
  };

  const calculateTotals = (updatedProducts, discount, vat) => {
    const newTotalAmount = updatedProducts.reduce(
      (sum, product) => sum + (product.totalAmount || 0),
      0
    );

    // คำนวณ VAT ก่อน
    const vatAmount = (newTotalAmount * (Number(vat) || 0)) / 100;
    const totalWithVat = newTotalAmount + vatAmount;

    // คำนวณส่วนลดจากยอดรวมภาษี
    const discountAmount = (totalWithVat * (Number(discount) || 0)) / 100;

    // คำนวณยอดสุทธิ
    const newNetAmount = totalWithVat - discountAmount;

    return { newTotalAmount, newNetAmount };
  };

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [id]: type === "number" ? Number(value) || 0 : value, // ถ้าเป็นตัวเลขแปลงเป็น Number ถ้าเป็น select ให้ใช้ value ตรงๆ
      };

      if (id === "discount" || id === "vat") {
        const { newTotalAmount, newNetAmount } = calculateTotals(
          prevData.products,
          updatedData.discount,
          updatedData.vat
        );
        updatedData.totalAmount = newTotalAmount;
        updatedData.netAmount = newNetAmount;
      }

      return updatedData;
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedProducts = [...prevData.products];
    
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: name === "quantity" || name === "unitPrice" ? Number(value) || 0 : value,
      };
    
      if (name === "quantity" || name === "unitPrice") {
        updatedProducts[index].totalAmount =
          (updatedProducts[index].quantity || 0) *
          (updatedProducts[index].unitPrice || 0);
      }
    
      const { newTotalAmount, newNetAmount } = calculateTotals(
        updatedProducts,
        prevData.discount,
        prevData.vat
      );
    
      return {
        ...prevData,
        products: updatedProducts,
        totalAmount: newTotalAmount,
        netAmount: newNetAmount,
      };
    });
    
  };
  
  const handleSubmit = () => {
    if (!formData.idPO || !formData.datePO || !formData.employeeName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    fetch("http://localhost:3000/purchase-orders", {
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
        navigate("/purchase-orders", { state: { orderData: formData } });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการส่งคำขอ");
      });
  };


  const renderDatePicker = (id, selectedDate, onChange) => (
    <DatePicker
      selected={selectedDate ? new Date(selectedDate) : null}
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      className="date-picker"
    />
  );

  return (
    <div className="po-purchase-requisition">
      <h2>การจัดทำใบสั่งซื้อ (Purchase Order - PO)</h2>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="idPO">ID-PO/NO:</label>
          <input
            type="text"
            id="idPO"
            value={formData.idPO}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="datePO">วันที่:</label>
          <input
            type="date"
            id="datePO"
            value={formData.datePO}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="po-row">
        <div className="po-column">
          <label htmlFor="employeeName">ชื่อพนักงาน:</label>
          <input
            type="text"
            id="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="employeePosition">ตำแหน่งพนักงาน:</label>
          <input
            type="text"
            id="employeePosition"
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

      <h3>รายการสินค้า</h3>
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
          {formData.products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="item"
                  value={product.item}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  value={product.unit}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  value={product.unitPrice}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  value={product.totalAmount}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} id="po-addRowBtn">
        เพิ่มแถว
      </button>

      <h3>ข้อมูลการชำระเงิน</h3>
      <div className="po-row">
        <div className="po-column">
          <label htmlFor="totalAmount">จำนวนเงิน:</label>
          <input
            type="text"
            id="totalAmount"
            value={formData.totalAmount}
            readOnly
          />
        </div>
        <div className="po-column">
          <label htmlFor="vat">เงินรวมภาษีมูลค่าเพิ่ม 7 % :</label>
          <input
            type="number"
            id="vat"
            value={formData.vat}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="discount">ส่วนลด(%):</label>
          <input
            type="number"
            id="discount"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>
        <div className="po-column">
          <label htmlFor="netAmount">รวมเงินทั้งสุทธิ:</label>
          <input
            type="text"
            id="netAmount"
            value={formData.netAmount}
            readOnly
          />
        </div>
      </div>

      <div className="po-row">
        <div className="po-column">
          <label htmlFor="payment">การชำระเงิน:</label>
          <select
            id="payment"
            value={formData.payment}
            onChange={handleInputChange}
          >
            <option value="ชำระเงินก่อนรับสินค้า">ชำระเงินก่อนรับสินค้า</option>
            <option value="ชำระเงินหลังได้รับสินค้า">
              ชำระเงินหลังได้รับสินค้า
            </option>
            <option value="ชำระเงินแบบเครดิต">ชำระเงินแบบเครดิต</option>
            <option value="ชำระเงินเป็นงวดตามสัญญา">
              ชำระเงินเป็นงวดตามสัญญา
            </option>
          </select>
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
        </div>
        <div className="column">
          <label htmlFor="purchaser">ผู้จัดซื้อ:</label>
          <input
            type="text"
            id="purchaser"
            value={formData.purchaser}
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
        </div>
      </div>

      <div className="row">
        <div className="column">
          <label htmlFor="date-approval">วันที่อนุมัติ 1:</label>
          {renderDatePicker("date-approval", formData.dateApproval, (date) =>
            setFormData({ ...formData, dateApproval: date })
          )}
        </div>
        <div className="column">
          <label htmlFor="date-approval2">วันที่อนุมัติ 2:</label>
          {renderDatePicker("date-approval2", formData.dateApproval2, (date) =>
            setFormData({ ...formData, dateApproval2: date })
          )}
        </div>
        <div className="column">
          <label htmlFor="date-approval3">วันที่อนุมัติ 3:</label>
          {renderDatePicker("date-approval3", formData.dateApproval3, (date) =>
            setFormData({ ...formData, dateApproval3: date })
          )}
        </div>
      </div>

      <button type="button" id="submitRequestBtn" onClick={handleSubmit}>
        ส่งคำขอ
      </button>
    </div>
  );
};

export default PO;
