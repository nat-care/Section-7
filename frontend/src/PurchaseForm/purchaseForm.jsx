import { useState, useEffect } from "react";

const PurchaseForm = () => {
  const [userId, setUserId] = useState("");
  const [dept, setDept] = useState("");
  const [position, setPosition] = useState("");
  const [subject, setSubject] = useState("");
  const [list, setList] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [countingUnit, setCountingUnit] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [token] = useState(localStorage.getItem("token") || "");

  // Auto-calculate total amount
  useEffect(() => {
    setTotalAmount(quantity * unitPrice);
  }, [quantity, unitPrice]);

  const handlePurchaseRequestSubmit = async (e) => {
    e.preventDefault();

    const purchaseRequest = {
      user_id: userId,
      dept,
      position,
      subject,
      list,
      quantity,
      counting_unit: countingUnit,
      unit_price: unitPrice,
      total_amount: totalAmount,
    };

    try {
      const response = await fetch("http://localhost:3000/purchase-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify(purchaseRequest),
      });

      const data = await response.json();
      if (response.ok) {
        alert("ส่งใบขอซื้อสำเร็จ!");
        console.log("Response:", data);

        // Clear form after successful submission
        setUserId("");
        setDept("");
        setPosition("");
        setSubject("");
        setList("");
        setQuantity(0);
        setCountingUnit("");
        setUnitPrice(0);
        setTotalAmount(0);
      } else {
        alert("เกิดข้อผิดพลาด: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการส่งใบขอซื้อ");
    }
  };

  return (
    <div>
      <h2>ฟอร์มใบขอซื้อ</h2>
      <form onSubmit={handlePurchaseRequestSubmit}>
        <label>รหัสผู้ใช้ (User ID):</label>
        <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />

        <label>แผนก:</label>
        <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} required />

        <label>ตำแหน่ง:</label>
        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />

        <label>หัวข้อ/เรื่อง:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />

        <label>รายการสินค้า:</label>
        <input type="text" value={list} onChange={(e) => setList(e.target.value)} required />

        <label>จำนวน:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />

        <label>หน่วยนับ:</label>
        <input type="text" value={countingUnit} onChange={(e) => setCountingUnit(e.target.value)} required />

        <label>ราคาต่อหน่วย:</label>
        <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} required />

        <label>จำนวนเงินรวม (อัตโนมัติ):</label>
        <input type="number" value={totalAmount} readOnly />

        <button type="submit">ส่งใบขอซื้อ</button>
      </form>
    </div>
  );
};

export default PurchaseForm;
