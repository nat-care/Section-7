// Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const goToCardList = () => {
    navigate("/cardlist");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear(); // เคลียร์ข้อมูล session
    navigate("/");        // กลับหน้า login หรือหน้าแรก
  };

  return (
    <div className="minimal-navbar">
      <div className="navbar-dots" onClick={toggleDropdown}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={goToCardList}>
            ตรวจสอบสิทธิ
          </div>
          <div className="dropdown-item" onClick={handleLogout}>
            ออกจากระบบ
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
