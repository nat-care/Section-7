import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbarWorker.css";

const NavbarWK = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const goToSelectPages = () => {
    navigate("/selectpages"); // ➕ เพิ่มเส้นทางไปยังหน้า selectPages
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear(); // ล้าง session
    navigate("/");        // กลับหน้า login
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
          <div className="dropdown-item" onClick={goToSelectPages}>
            กลับหน้าเลือกฟอร์ม
          </div>
          <div className="dropdown-item" onClick={handleLogout}>
            ออกจากระบบ
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarWK;
