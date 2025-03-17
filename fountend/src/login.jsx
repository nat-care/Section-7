export const handleLogin = async (username, password, setToken, setRole) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (data.token) {
        setToken(data.token);
        setRole(data.role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  export const handleLogout = (setToken, setRole) => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };
  