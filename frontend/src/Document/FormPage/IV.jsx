import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IV.css";

const IV = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idIV: "", // กรอกเฉพาะตัวเลข (เช่น 66044013)
    companyThatMustPay: "",
    detail: "",
    products: [],
    totalAmount: "",
    vat: "",
    netAmount: "",
    payment: "", // รายละเอียดการชำระเงิน
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
    department: "" // ซิงค์กับ idIV
  });

  // State สำหรับเก็บ Purchase Orders ที่ดึงมาจาก backend
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // ดึงข้อมูล Purchase Orders ทั้งหมดจาก backend เมื่อ component mount
  useEffect(() => {
    fetch("http://localhost:3000/purchase-orders")
      .then((response) => response.json())
      .then((data) => {
        setPurchaseOrders(data);
      })
      .catch((error) =>
        console.error("Error fetching purchase orders:", error)
      );
  }, []);

  // เมื่อผู้ใช้กรอก idIV (ตัวเลข) ระบบจะค้นหา PO ที่ตรงกัน
  useEffect(() => {
    if (formData.idIV && purchaseOrders.length > 0) {
      const idStr = formData.idIV.toString().trim();
      const searchStr = "ใบสั่งซื้อ - " + idStr;
      const matchedPO = purchaseOrders.find((po) => {
        const poName = po.name.trim();
        // แบบแรก: ถ้ามี prefix "ใบสั่งซื้อ - " แล้วตัวเลขตรงกัน
        if (poName === searchStr) return true;
        // แบบที่สอง: ถ้า PO มีชื่อเป็นตัวเลขเพียว ๆ และตรงกับ idIV
        if (/^\d+$/.test(poName) && poName === idStr) return true;
        return false;
      });

      if (matchedPO) {
        // ถ้าพบ PO ที่ตรงกัน ให้ดึงข้อมูลมาเซ็ตในฟอร์ม
        setFormData((prev) => ({
          ...prev,
          department: idStr, // ซิงค์กับ idIV
          detail: matchedPO.detail || "",
          products: matchedPO.products
            ? matchedPO.products.map((prod) => ({
                item: prod.item,
                quantity: prod.quantity,
                unit: prod.unit,
                unitPrice: prod.unitPrice,
                totalAmount: parseFloat(prod.totalAmount).toFixed(2)
              }))
            : [],
          totalAmount: matchedPO.totalAmount
            ? parseFloat(matchedPO.totalAmount).toFixed(2)
            : "",
          vat: matchedPO.vat
            ? parseFloat(matchedPO.vat).toFixed(2)
            : "",
          netAmount: matchedPO.netAmount
            ? parseFloat(matchedPO.netAmount).toFixed(2)
            : "",
          payment: matchedPO.payment || ""
        }));
      } else {
        // ถ้าไม่พบ PO ที่ตรงกัน ให้เคลียร์ข้อมูลที่เกี่ยวข้อง
        setFormData((prev) => ({
          ...prev,
          detail: "",
          products: [],
          totalAmount: "",
          vat: "",
          netAmount: "",
          payment: ""
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.idIV, purchaseOrders]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงฟิลด์
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "idIV") {
      setFormData((prev) => ({
        ...prev,
        idIV: value,
        department: value // ซิงค์รหัสอ้างอิง
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value
      }));
    }
  };

  // จัดการการเปลี่ยนแปลงในตารางสินค้า (กรณีผู้ใช้แก้ไขด้วยตนเอง)
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      const newQuantity =
        name === "quantity"
          ? parseFloat(value) || 0
          : parseFloat(updatedProducts[index].quantity) || 0;
      const newUnitPrice =
        name === "unitPrice"
          ? parseFloat(value) || 0
          : parseFloat(updatedProducts[index].unitPrice) || 0;

      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
        totalAmount:
          name === "quantity" || name === "unitPrice"
            ? (newQuantity * newUnitPrice).toFixed(2)
            : updatedProducts[index].totalAmount
      };

      return { ...prev, products: updatedProducts };
    });
  };

  // ฟังก์ชันส่งข้อมูล Invoice ไปยัง backend
  const handleSubmit = async () => {
    // ตรวจสอบฟิลด์ที่จำเป็น
    const requiredFields = [
      "idIV",
      "companyThatMustPay",
      "detail",
      "totalAmount",
      "vat",
      "netAmount",
      "payment"
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
        body: JSON.stringify(formData)
      });

      console.log("Response Status:", response.status);
      const resBody = await response.json();
      console.log("Response Body:", resBody);

      if (response.ok) {
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

      {/* ข้อมูลทั่วไป */}
      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="idIV" className="invoice-page__input-label">
            รหัสอ้างอิง (กรอกเฉพาะตัวเลข)
          </label>
          <input
            type="number"
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

      {/* ที่อยู่และอีเมล */}
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

      {/* ข้อมูลชำระเงิน */}
      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="department" className="invoice-page__input-label">
            รหัสอ้างอิง:
          </label>
          <input
            type="number"
            id="department"
            className="invoice-page__input"
            value={formData.department}
            readOnly
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

      {/* ข้อมูลเพิ่มเติม */}
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

      {/* Tax ID & เรื่องรายละเอียด */}
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

      {/* ตารางรายการสินค้า */}
      <h3 className="invoice-page__section-title">รายการสินค้า</h3>
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

      {/* แสดงยอดรวมและภาษี */}
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
            readOnly
          />
        </div>
        <div className="invoice-page__column">
          <label htmlFor="vat" className="invoice-page__input-label">
            ภาษีมูลค่าเพิ่ม (7%):
          </label>
          <input
            type="text"
            id="vat"
            className="invoice-page__input"
            value={formData.vat}
            readOnly
          />
        </div>
      </div>

      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="netAmount" className="invoice-page__input-label">
            รวมเงินทั้งสิ้น (สุทธิ):
          </label>
          <input
            type="text"
            id="netAmount"
            className="invoice-page__input"
            value={formData.netAmount}
            readOnly
          />
        </div>
      </div>

      {/* รายละเอียดการชำระเงิน (เพิ่มตัวเลือกตามรูป) */}
      <div className="invoice-page__row">
        <div className="invoice-page__column">
          <label htmlFor="payment" className="invoice-page__input-label">
            รายละเอียดการชำระเงิน:
          </label>
          <select
            id="payment"
            className="invoice-page__input"
            value={formData.payment}
            onChange={handleInputChange}
          >
            <option value="">-- เลือกการชำระ --</option>
            <option value="ชำระเงินก่อนรับสินค้า">
              ชำระเงินก่อนรับสินค้า
            </option>
            <option value="ชำระเงินล่วงหน้า">
              ชำระเงินล่วงหน้า
            </option>
            <option value="ชำระเงินผ่านบัตรเครดิต">
              ชำระเงินผ่านบัตรเครดิต
            </option>
            <option value="ชำระเงินหลังรับสินค้า">
              ชำระเงินหลังรับสินค้า
            </option>
            <option value="จ่ายเต็ม">จ่ายเต็ม</option>
            <option value="แบ่งชำระ">แบ่งชำระ</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>
      </div>

      {/* ฟิลด์เพิ่มเติม */}
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
