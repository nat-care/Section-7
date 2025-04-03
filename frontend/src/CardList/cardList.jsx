import { useState, useEffect } from "react";
import "./cardList.css";

const CardList = () => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState(""); // ← เพิ่มตรงนี้
  const [newRole, setNewRole] = useState("Procurement Officer");

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleAddUser = () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    const newUser = {
      username: newUsername,
      password: newPassword, // ← ส่ง password ไปด้วย
      role: newRole,
    };

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add user");
        return res.json();
      })
      .then((addedUser) => {
        console.log("Added user from server:", addedUser);
        setUsers((prev) => [...prev, addedUser]);
        setNewUsername("");
        setNewPassword(""); // ← เคลียร์ช่อง password
        setNewRole("Procurement Officer");
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  return (
    <div className="card-list-container">
      <div className="container">
        <div className="content">
          <h1 className="header">Warehouse Procurement System</h1>

          {/* User List */}
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
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>

          {/* Add New User Form */}
          <div className="add-user-form">
            <input
              type="text"
              placeholder="ชื่อผู้ใช้ใหม่"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="IT Administrator">IT Administrator</option>
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Management & Approvers">Management & Approvers</option>
            </select>
            <button className="add-btn" onClick={handleAddUser}>
              เพิ่มผู้ใช้
            </button>
          </div>

          <button className="submit-btn">ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default CardList;
