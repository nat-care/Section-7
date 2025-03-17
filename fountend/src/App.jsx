import { useState, useEffect } from "react";
import { handleLogin, handleLogout } from "./login"; // นำเข้าไฟล์ auth.js

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  // ตรวจสอบ token และ role ที่บันทึกไว้ใน localStorage ตอนโหลดหน้า
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  // ฟังก์ชันสำหรับส่งข้อมูลฟอร์มใบขอซื้อ
  const handlePurchaseRequestSubmit = (e) => {
    e.preventDefault(); // ป้องกันการโหลดหน้าใหม่
    const purchaseRequest = {
      user_id: userId,
      description,
      total_amount: totalAmount,
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
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div>
            <label>รายละเอียด:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>จำนวนเงิน:</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
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
