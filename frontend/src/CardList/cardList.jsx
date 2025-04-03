import { useState, useEffect } from "react";
import "./cardList.css";

const CardList = () => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullname, setNewFullname] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newPosition, setNewPosition] = useState(""); // ← เพิ่มตรงนี้
  const [newRole, setNewRole] = useState("Procurement Officer");

  useEffect(() => {
    fetchUsers(); // ดึงข้อมูลเมื่อโหลดหน้า
  }, []);

  const fetchUsers = () => {
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
  };

  const handleAddUser = () => {
    if (!newUsername.trim() || !newPassword.trim() || !newFullname.trim() || !newDepartment.trim() || !newPosition.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const newUser = {
      username: newUsername,
      password: newPassword,
      fullname: newFullname,
      department: newDepartment,
      position: newPosition, 
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
        fetchUsers();
        setNewUsername("");
        setNewPassword("");
        setNewFullname("");
        setNewDepartment("");
        setNewPosition(""); 
        setNewRole("Procurement Officer");
      })
      .catch((error) => console.error("Error adding user:", error));
  };
  const handleRoleChange = (id, newRole) => {
    // อัปเดตใน state ก่อน
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);  // อัปเดต state ของผู้ใช้
  
    // อัปเดตในฐานข้อมูล
    fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
      .then(res => res.json())
      .then(updatedUser => console.log('Updated user role:', updatedUser))
      .catch(error => console.error('Error updating user role:', error));
  };  

  const handleDeleteUser = (id) => {
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        console.log(`Deleted user with ID ${id}`);
      })
      .catch((error) => console.error("Error deleting user:", error));
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
                       <input
              type="text"
              placeholder="ชื่อเต็ม"
              value={newFullname}
              onChange={(e) => setNewFullname(e.target.value)}
            />
            <input
              type="text"
              placeholder="แผนก"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            />
            <input
              type="text"
              placeholder="ตำแหน่ง"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default CardList;
