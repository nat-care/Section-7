import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SN.css"; 

const SN = () => {
  const [rows, setRows] = useState([1]); // Initial row
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idSN: "",
    dateSN: "",
    employeeName: "",
    employeePosition: "",
    senderName: "",
    detail: "",
    products: [],
    totalAmount: "",
    notes: "",
    sender: "",
    reciver: "",
    dateApproval: "",
    dateApproval2: "",
    parcelNumber: "",
    comments: "",
    transportCompany: "",
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

    // Calculate totalAmount for the product
    if (updatedProducts[index].quantity && updatedProducts[index].unitPrice) {
      updatedProducts[index].totalAmount =
        updatedProducts[index].quantity * updatedProducts[index].unitPrice;
    }

    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const handleSubmit = () => {
    if (!formData.idSN || !formData.dateSN || !formData.employeeName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    // Send the form data to the server via POST request
    fetch("http://localhost:3000/shipping-notes", {
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
        navigate("/shipping-notes", { state: { noteData: formData } });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการส่งคำขอ");
      });
  };

  return (
    <div className="invoice-page">
      <h2 className="invoice-page__title">ใบส่งพัสดุ  Shipping Note</h2>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="idSN" className="invoice-page__input-label">ID-SN/NO:</label>
          <input
            type="text"
            id="idSN"
            value={formData.idSN}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>

        <div className="invoice-page__column">
          <label htmlFor="dateSN" className="invoice-page__input-label">วันที่:</label>
          <input
            type="date"
            id="dateSN"
            value={formData.dateSN}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="employeeName" className="invoice-page__input-label">ชื่อพนักงานผู้รับ:</label>
          <input
            type="text"
            id="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>

        <div className="invoice-page__column">
          <label htmlFor="employeePosition" className="invoice-page__input-label">รหัสพนักงาน:</label>
          <input
            type="text"
            id="employeePosition"
            value={formData.employeePosition}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="senderName" className="invoice-page__input-label">ชื่อผู้ส่ง:</label>
          <input
            type="text"
            id="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="detail" className="invoice-page__input-label">เรื่องรายละเอียด:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <h3 className="invoice-page__section-title">โปรดกรอกข้อมูลสินค้า</h3>
      <table className="invoice-page__table">
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
                  className="invoice-page__product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={formData.products[index]?.quantity || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="invoice-page__product-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  value={formData.products[index]?.unit || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="invoice-page__product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.products[index]?.unitPrice || ""}
                  onChange={(e) => handleProductChange(index, e)}
                  className="invoice-page__product-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.products[index]?.totalAmount || ""}
                  readOnly
                  className="invoice-page__product-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} className="invoice-page__button">
        เพิ่มแถว
      </button>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="transportCompany" className="invoice-page__input-label">บริษัทขนส่ง:</label>
          <input
            type="text"
            id="transportCompany"
            value={formData.transportCompany}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="parcelNumber" className="invoice-page__input-label">หมายเลขพัสดุ:</label>
          <input
            type="text"
            id="parcelNumber"
            value={formData.parcelNumber}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="comments" className="invoice-page__input-label">หมายเหตุ:</label>
          <input
            type="text"
            id="comments"
            value={formData.comments}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="sender" className="invoice-page__input-label">ผู้ส่งพัสดุ:</label>
          <input
            type="text"
            id="sender"
            value={formData.sender}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
        <div className="invoice-page__column">
          <label htmlFor="reciver" className="invoice-page__input-label">ผู้รับพัสดุ:</label>
          <input
            type="text"
            id="reciver"
            value={formData.reciver}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="dateApproval" className="invoice-page__input-label">วันที่:</label>
          <input
            type="date"
            id="dateApproval"
            value={formData.dateApproval}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
        <div className="invoice-page__column">
          <label htmlFor="dateApproval2" className="invoice-page__input-label">วันที่:</label>
          <input
            type="date"
            id="dateApproval2"
            value={formData.dateApproval2}
            onChange={handleInputChange}
            className="invoice-page__input"
          />
        </div>
      </div>

      <div className="invoice-page__buttons">
        {/* <button type="button" className="invoice-page__button">
          แก้ไขคำขอ
        </button> */}
        <button type="button" className="invoice-page__submit-button" onClick={handleSubmit}>
          ส่งคำขอ
        </button>
      </div>
    </div>
  );
};

export default SN;