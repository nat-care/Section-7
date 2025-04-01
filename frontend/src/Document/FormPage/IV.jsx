import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./IV.css";

const IV = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idIV: "",
    companyThatMustPay: "",
    detail: "",
    products: [],
    totalAmount: "",
    discount: "",
    vat: "",
    netAmount: "",
    payment: "",
    notes: "",
    companyName: "",
    companyAddress: "",
    companyAddress2: "",
    taxID: "",
    email1: "",
    email2: "",
    penalty: "",
    approver: "",
    staff: "",
    dateApproval: "",
    dateApproval2: "",
  });

  // เพิ่มฟังก์ชันคำนวณยอดรวม, ส่วนลด, ภาษี, และยอดสุทธิ
  const calculateTotals = () => {
    // 1) รวม totalAmount ของสินค้าทุกชิ้น
    const sumOfLineItems = formData.products.reduce((acc, product) => {
      // product.totalAmount อาจเป็น string หรือ undefined ต้องแน่ใจว่าเป็นตัวเลข
      const itemTotal = parseFloat(product.totalAmount) || 0;
      return acc + itemTotal;
    }, 0);

    // 2) parse discount ให้เป็นตัวเลข
    const discountValue = parseFloat(formData.discount) || 0;

    // 3) คำนวณยอดหลังหักส่วนลด
    const discounted = sumOfLineItems - discountValue;

    // ป้องกันไม่ให้ติดลบ ถ้าไม่ต้องการให้ส่วนลดมากกว่ายอดรวม
    // const discounted = Math.max(sumOfLineItems - discountValue, 0);

    // 4) คำนวณ VAT 7%
    const vatValue = discounted * 0.07;

    // 5) สรุปยอดสุทธิ
    const netValue = discounted + vatValue;

    // 6) อัปเดตค่าใน formData
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: sumOfLineItems.toFixed(2),
      vat: vatValue.toFixed(2),
      netAmount: netValue.toFixed(2),
    }));
  };

  // ใช้ useEffect เรียก calculateTotals ทุกครั้งที่ products หรือ discount เปลี่ยน
  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line
  }, [formData.products, formData.discount]);

  const addRow = () => {
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
    setFormData((prevData) => {
      const updatedProducts = [...prevData.products];

      // แปลงค่า quantity และ unitPrice เป็นตัวเลขก่อนคำนวณ
      const newQuantity =
        name === "quantity" ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].quantity) || 0;
      const newUnitPrice =
        name === "unitPrice" ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].unitPrice) || 0;

      // ถ้าเปลี่ยน quantity หรือ unitPrice ให้คำนวณ totalAmount ใหม่
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
        totalAmount:
          name === "quantity" || name === "unitPrice"
            ? (newQuantity * newUnitPrice).toFixed(2)
            : updatedProducts[index].totalAmount,
      };

      return { ...prevData, products: updatedProducts };
    });
  };

  const handleSubmit = async () => {
    // ตรวจสอบฟิลด์ที่จำเป็น
    const requiredFields = [
      "idIV",
      "companyThatMustPay",
      "detail",
      "totalAmount",
      "vat",
      "netAmount",
      "payment",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Missing required field: ${field}`);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3000/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response Status:", response.status);
      console.log("Response Body:", await response.json());

      if (response.ok) {
        console.log("Form Data sent to the server successfully.");
        alert("ส่งคำขอเรียบร้อย!");
        navigate("/invoices");
      } else {
        console.error("Error sending form data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="invoice-page">
      <h2 className="invoice-page__title">ใบแจ้งหนี้ (Invoice)</h2>

      {/* ฟอร์มข้อมูลทั่วไป */}
      <label htmlFor="" className="invoice-page__label">
        ผู้ส่งใบแจ้งหนี้
      </label>
      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="idIV" className="invoice-page__input-label">
            รหัสอ้างอิง
          </label>
          <input
            type="text"
            id="idIV"
            className="invoice-page__input"
            value={formData.idIV}
            onChange={handleInputChange}
          />
        </div>
        <div className="invoice-page__column">
          <label htmlFor="companyName" className="invoice-page__input-label">
            ชื่อบริษัท
          </label>
          <input
            type="text"
            id="companyName"
            className="invoice-page__input"
            value={formData.companyName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="companyAddress" className="invoice-page__input-label">
            ที่อยู่ของบริษัท
          </label>
          <input
            type="text"
            id="companyAddress"
            className="invoice-page__input"
            value={formData.companyAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className="invoice-page__column">
          <label htmlFor="email1" className="invoice-page__input-label">
            อีเมล:
          </label>
          <input
            type="email"
            id="email1"
            className="invoice-page__input"
            value={formData.email1}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <label htmlFor="" className="invoice-page__label">
        ชำระเงินหนี้
      </label>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="department" className="invoice-page__input-label">
            รหัสอ้างอิง:
          </label>
          <input
            type="text"
            id="department"
            className="invoice-page__input"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>
        <div className="invoice-page__column">
          <label
            htmlFor="companyThatMustPay"
            className="invoice-page__input-label"
          >
            ชื่อบริษัทที่ต้องชำระเงิน:
          </label>
          <input
            type="text"
            id="companyThatMustPay"
            className="invoice-page__input"
            value={formData.companyThatMustPay}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label
            htmlFor="companyAddress2"
            className="invoice-page__input-label"
          >
            ที่อยู่ของบริษัท:
          </label>
          <input
            type="text"
            id="companyAddress2"
            className="invoice-page__input"
            value={formData.companyAddress2}
            onChange={handleInputChange}
          />
        </div>

        <div className="invoice-page__column">
          <label htmlFor="email2" className="invoice-page__input-label">
            อีเมล:
          </label>
          <input
            type="text"
            id="email2"
            className="invoice-page__input"
            value={formData.email2}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="taxID" className="invoice-page__input-label">
            Tax ID:
          </label>
          <input
            type="text"
            id="taxID"
            className="invoice-page__input"
            value={formData.taxID}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="detail" className="invoice-page__input-label">
            เรื่องรายละเอียด:
          </label>
          <input
            type="text"
            id="detail"
            className="invoice-page__input"
            value={formData.detail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3 className="invoice-page__section-title">โปรดกรอกข้อมูลสินค้า</h3>
      <table id="productTable" className="invoice-page__table">
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
          {formData.products.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="item"
                  className="invoice-page__product-input"
                  value={row.item || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  className="invoice-page__product-input"
                  value={row.quantity || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="unit"
                  className="invoice-page__product-input"
                  value={row.unit || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="unitPrice"
                  className="invoice-page__product-input"
                  value={row.unitPrice || ""}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="totalAmount"
                  className="invoice-page__product-input"
                  value={row.totalAmount || ""}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row Button */}
      <button onClick={addRow} className="invoice-page__button" id="addRowBtn">
        เพิ่มแถว
      </button>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="totalAmount" className="invoice-page__input-label">
            จำนวนเงิน (รวม):
          </label>
          <input
            type="text"
            id="totalAmount"
            className="invoice-page__input"
            value={formData.totalAmount}
            onChange={handleInputChange}
            readOnly // อ่านอย่างเดียว
          />
        </div>

        <div className="invoice-page__column">
          <label htmlFor="discount" className="invoice-page__input-label">
            ส่วนลด:
          </label>
          <input
            type="number"
            id="discount"
            className="invoice-page__input"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="vat" className="invoice-page__input-label">
            ภาษีมูลค่าเพิ่ม (7%):
          </label>
          <input
            type="text"
            id="vat"
            className="invoice-page__input"
            value={formData.vat}
            onChange={handleInputChange}
            readOnly // อ่านอย่างเดียว
          />
        </div>

        <div className="invoice-page__column">
          <label htmlFor="netAmount" className="invoice-page__input-label">
            รวมเงินทั้งสิ้น (สุทธิ):
          </label>
          <input
            type="text"
            id="netAmount"
            className="invoice-page__input"
            value={formData.netAmount}
            onChange={handleInputChange}
            readOnly // อ่านอย่างเดียว
          />
        </div>
      </div>

      {/* เปลี่ยนการชำระเงินเป็น select */}
      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="payment" className="invoice-page__input-label">
            การชำระเงิน:
          </label>
          <select
            id="payment"
            className="invoice-page__input"
            value={formData.payment}
            onChange={handleInputChange}
          >
            <option value="">-- เลือกการชำระ --</option>
            <option value="จ่ายเต็ม">จ่ายเต็ม</option>
            <option value="แบ่งชำระ">แบ่งชำระ</option>
          </select>
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="notes" className="invoice-page__input-label">
            หมายเหตุ:
          </label>
          <input
            type="text"
            id="notes"
            className="invoice-page__input"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="penalty" className="invoice-page__input-label">
            ค่าปรับ:
          </label>
          <input
            type="text"
            id="penalty"
            className="invoice-page__input"
            value={formData.penalty}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="approver" className="invoice-page__input-label">
            ผู้อนุมัติ:
          </label>
          <input
            type="text"
            id="approver"
            className="invoice-page__input"
            value={formData.approver}
            onChange={handleInputChange}
          />
        </div>
        <div className="invoice-page__column">
          <label htmlFor="staff" className="invoice-page__input-label">
            เจ้าหน้าที่:
          </label>
          <input
            type="text"
            id="staff"
            className="invoice-page__input"
            value={formData.staff}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="dateApproval" className="invoice-page__input-label">
            วันที่อนุมัติ:
          </label>
          <input
            type="date"
            id="dateApproval"
            className="invoice-page__input"
            value={formData.dateApproval}
            onChange={handleInputChange}
          />
        </div>

        <div className="invoice-page__column">
          <label htmlFor="dateApproval2" className="invoice-page__input-label">
            วันที่อนุมัติ:
          </label>
          <input
            type="date"
            id="dateApproval2"
            className="invoice-page__input"
            value={formData.dateApproval2}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <button onClick={handleSubmit} className="invoice-page__submit-button">
        บันทึกข้อมูล
      </button>
    </div>
  );
};

export default IV;
