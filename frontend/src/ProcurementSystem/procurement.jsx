import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/navbar";
import "./procurement.css";

const ProcurementSystem = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "IT Administrator") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      navigate("/selectpages");
      return;
    }

    fetch("http://localhost:3000/purchase-requests")
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
      .catch((error) =>
        console.error("Error fetching purchase requests:", error)
      );
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="box">
          <h2 className="title">Warehouse Procurement System</h2>
          {data.length === 0 ? (
            <p>ไม่มีข้อมูลใบขอซื้อ</p>
          ) : (
            <div>
              <div className="list-header">
                <span className="text-id">ID</span>
                <span className="text-code">รหัสเอกสาร</span>
                <span className="text-description">รายละเอียด</span>
                <span className="text-status">สถานะ</span>
              </div>
              {data.map((item, index) => (
                <div key={index} className="list-item">
                  <span className="text-id">{item.id}</span>
                  <span className="text-code">{item.name}</span>
                  <span className="text-description">{item.detail || "ไม่มีรายละเอียด"}</span>
                  <div
                    className={`status-circle ${getStatusColor(item.status)}`}
                    title={item.status}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcurementSystem;
