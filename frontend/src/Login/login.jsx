import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Restore session from localStorage when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  // Authentication function (previously in auth.js)
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const role = data.role;
        setToken(data.token);
        setRole(role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);
        alert("Login successful!");
  
        // ✅ Redirect according to role
        switch (role) {
          case "IT Administrator":
            navigate("/procurement");
            break;
          case "Procurement Officer":
          case "Finance & Accounting":
          case "Management & Approvers":
            navigate("/selectpages");
            break;
          default:
            alert("ไม่รู้จักบทบาทผู้ใช้");
            navigate("/login");
            break;
        }
  
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Please try again.");
    }
  };

  // Logout function (previously in auth.js)
  const handleLogout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Logged out successfully!");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-logo">logo</h1>
        <p className="login-system-name">Warehouse Procurement System</p>
        {!token ? (
          <>
            <h4 className="login-input-head-text">Username</h4>
            <input
              className="login-input"
              type="text"
              placeholder="USER NAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h4 className="login-input-head-text">Password</h4>
            <input
              className="login-input"
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="login-button"
              onClick={() => handleLogin(username, password)}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <p className="login-welcome-message">
              คุณเข้าสู่ระบบในบทบาท: <strong>{role}</strong>
            </p>
            <button className="login-logout-button" onClick={handleLogout}>
              Logout
            </button>
            {role === "Procurement Officer" && (
              <button
                className="login-purchase-button"
                onClick={() => navigate("/purchase")}
              >
                ไปที่ฟอร์มใบขอซื้อ
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
