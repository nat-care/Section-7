import { useState, useEffect } from "react";
import "./cardList.css";

const CardList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users") // เปลี่ยนเส้นทางเป็น API ที่ backend ให้บริการ
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // ตรวจสอบว่าข้อมูลถูกโหลดมาหรือไม่
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map(user => user.id === id ? { ...user, role: newRole } : user);
    setUsers(updatedUsers);

    // ส่งข้อมูลอัปเดตไปยัง backend
    fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update role");
        }
        return response.json();
      })
      .then((data) => console.log("Role updated successfully:", data))
      .catch((error) => console.error("Error updating role:", error));
  };

  return (
    <div className="card-list-container">
      <div className="container">
        <div className="content">
          <h1 className="header">Warehouse Procurement System</h1>
          <div className="user-list">
            {users.map((user) => (
              <div className="user-card" key={user.id}>
                <div className="user-info">
                  <span className="user-icon">👤</span>
                  <div className="user-details">
                    <span className="user-name">{user.username}</span>
                    <span className="user-id">{user.id}</span>
                  </div>
                </div>
                <select
                  className="dropdown"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="IT Administrator">IT Administrator</option>
                  <option value="Procurement Officer">Procurement Officer</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Management & Approvers">Management & Approvers</option>
                </select>
              </div>
            ))}
          </div>
          <button className="submit-btn">ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default CardList;
