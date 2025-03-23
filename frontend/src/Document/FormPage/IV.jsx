import React, { useState } from "react";

const IV = () => {
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
    console.log("Form Data:", formData);
    alert("ส่งคำขอเรียบร้อย!");
  };

  return (
    <div className="purchase-requisition">
      <h2>ใบแจ้งหนี้ (Invoice)</h2>

      {/* Form Section */}
      <label htmlFor="">ผู้ส่งใบแจ้งหนี้</label>
      <div className="row">
        <div className="column">
          <label htmlFor="id-pr">รหัสอ้างอิง</label>
          <input
            type="text"
            id="id-pr"
            value={formData.idPR}
            onChange={handleInputChange}
          />
        </div>
        <div className="column">
          <label htmlFor="id-pr">ชื่อบริษัท</label>
          <input
            type="text"
            id="id-pr"
            value={formData.idPR}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="row">
      <div className="column">
          <label htmlFor="id-pr">ที่อยู่ของบริษัท</label>
          <input
            type="text"
            id="id-pr"
            value={formData.idPR}
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
          <label htmlFor="detail">Tax ID:</label>
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
          <label htmlFor="detail">จำนวนเงิน:</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>

        <div className="column">
          <label htmlFor="section">ส่วนลด:</label>
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
          <label htmlFor="detail">ภาษีมูลค่าเพิ่ม :</label>
          <input
            type="text"
            id="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>

        <div className="column">
          <label htmlFor="section">รวมเงินทั้งสุทธิ:</label>
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
          <label htmlFor="notes">การชำระเงิน:</label>
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
          <label htmlFor="notes">ค่าปรับหรือดอกเบี้ยในกรณีชำระล่าช้า:</label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="row">
   
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
