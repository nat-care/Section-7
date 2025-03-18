import { useState, useEffect } from "react";
import { handleLogin, handleLogout } from "./login"; // นำเข้าไฟล์ auth.js

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  // ข้อมูลฟอร์มใบขอซื้อ
  const [userId, setUserId] = useState("");
  const [dept, setDept] = useState(""); // แผนก
  const [position, setPosition] = useState(""); // ตำแหน่ง
  const [subject, setSubject] = useState(""); // หัวข้อ/เรื่อง
  const [list, setList] = useState(""); // รายการสินค้า
  const [quantity, setQuantity] = useState(""); // จำนวน
  const [countingUnit, setCountingUnit] = useState(""); // หน่วยนับ
  const [unitPrice, setUnitPrice] = useState(""); // ราคาต่อหน่วย
  const [totalAmount, setTotalAmount] = useState(""); // จำนวนเงินรวม


  // ตรวจสอบ token และ role ที่บันทึกไว้ใน localStorage ตอนโหลดหน้า
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const handlePurchaseRequestSubmit = (e) => {
    e.preventDefault(); // ป้องกันการโหลดหน้าใหม่
    const purchaseRequest = {
      user_id: userId,
      dept,
      position,
      subject,
      list,
      quantity: Number(quantity), // แปลงเป็นตัวเลข
      counting_unit: countingUnit,
      unit_price: Number(unitPrice), // แปลงเป็นตัวเลข
      total_amount: Number(totalAmount), // แปลงเป็นตัวเลข
    };

    // ส่งข้อมูลไปยัง API ที่เซิร์ฟเวอร์
    fetch("http://localhost:3000/purchase-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseRequest),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("ส่งใบขอซื้อสำเร็จ!");
        console.log(data);
      })
      .catch((error) => {
        alert("เกิดข้อผิดพลาดในการส่งใบขอซื้อ");
        console.error("Error:", error);
      });
  };

  // ฟอร์มใบขอซื้อ
  const renderPurchaseRequestForm = () => {
    return (
      <div>
        <h2>ฟอร์มใบขอซื้อ</h2>
        <form onSubmit={handlePurchaseRequestSubmit}>
          <div>
            <label>รหัสผู้ใช้ (User ID):</label>
            <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />
          </div>
          <div>
            <label>แผนก:</label>
            <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} required />
          </div>
          <div>
            <label>ตำแหน่ง:</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </div>
          <div>
            <label>หัวข้อ/เรื่อง:</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <label>รายการสินค้า:</label>
            <input type="text" value={list} onChange={(e) => setList(e.target.value)} required />
          </div>
          <div>
            <label>จำนวน:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
          <div>
            <label>หน่วยนับ:</label>
            <input type="text" value={countingUnit} onChange={(e) => setCountingUnit(e.target.value)} required />
          </div>
          <div>
            <label>ราคาต่อหน่วย:</label>
            <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
          </div>
          <div>
            <label>จำนวนเงินรวม:</label>
            <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
          </div>
          <button type="submit">ส่งใบขอซื้อ</button>
        </form>
      </div>
    );
  };

  return (
    <div>
      <h1>LOGIN</h1>
      {!token ? (
        <>
          <div>
            Username:{" "}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            Password:{" "}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={() => handleLogin(username, password, setToken, setRole)}
          >
            Login
          </button>
        </>
      ) : (
        <>
          <p>
            คุณเข้าสู่ระบบในบทบาท: <strong>{role}</strong>
          </p>
          <button onClick={() => handleLogout(setToken, setRole)}>
            Logout
          </button>
          {role === "Procurement Officer" && renderPurchaseRequestForm()}{" "}
          {/* แสดงฟอร์มใบขอซื้อเฉพาะเมื่อบทบาทเป็น "Procurement Officer" */}
        </>
      )}
    </div>
  );
}

export default App;
