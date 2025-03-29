import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./procurement.css";

const ProcurementSystem = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "IT Administrator") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      navigate("/selectpages");
      return; // ⛔️ หยุด ไม่ต้อง fetch ถ้าไม่มีสิทธิ์
    }

    // ✅ เรียก fetch ต่อเมื่อ role ถูกต้อง
    fetch("http://localhost:3000/purchase_requests")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setData(data);
      })
      .catch((error) => console.error("Error fetching purchase requests:", error));
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      default:
        return "red";
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2 className="title">Warehouse Procurement System</h2>
        {data.length === 0 ? (
          <p>ไม่มีข้อมูลใบขอซื้อ</p>
        ) : (
          <div>
            {data.map((item, index) => (
              <div key={index} className="list-item">
                <span className="text-id">{item.id}</span>
                <span className="text-code">{item.subject}</span>
                <span className="text-description">{item.list}</span>
                <div className={`status-circle ${getStatusColor(item.status)}`} />
              </div>
            ))}
          </div>
        )}
        <div className="button-container">
          <button className="back-button">ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSystem;
