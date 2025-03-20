
// import "./procurement.css";

// const ProcurementSystem = () => {
//   const data = [
//     { id: "45546xxx", code: "PR788909", description: "ใบจัดซื้อสินค้าภายใน", status: "green" },
//     { id: "45546xxx", code: "PR5429881", description: "ใบจัดซื้อสินค้าอุปกรณ์", status: "green" },
//     { id: "45546xxx", code: "PR5429881", description: "ใบสั่งซื้อสินค้าxxxx", status: "orange" },
//     { id: "45546xxx", code: "PR788909", description: "ใบรับพัสดุสินค้าxxxx", status: "orange" },
//     { id: "45546xxx", code: "PR0223981", description: "ใบสั่งซื้อสินค้าxxxx", status: "orange" },
//     { id: "45546xxx", code: "PR0223981", description: "ใบครบสินค้า", status: "red" },
//   ];

//   return (
//     <div className="container">
//       <div className="box">
//         <h2 className="title">Warehouse Procurement System</h2>
//         <div>
//           {data.map((item, index) => (
//             <div key={index} className="list-item">
//               <span className="text-id">{item.id}</span>
//               <span className="text-code">{item.code}</span>
//               <span className="text-description">{item.description}</span>
//               <div className={`status-circle ${item.status}`} />
//             </div>
//           ))}
//         </div>
//         <div className="button-container">
//           <button className="back-button">ยืนยัน</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProcurementSystem;

import { useState, useEffect } from "react";
import "./procurement.css";

const ProcurementSystem = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/purchase_requests") // ดึงข้อมูลจาก API purchase_requests
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // ตรวจสอบว่าข้อมูลถูกโหลดมาหรือไม่
        setData(data);
      })
      .catch((error) => console.error("Error fetching purchase requests:", error));
  }, []);

  // กำหนดสีของสถานะ
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
        <div className="button-container">
          <button className="back-button">ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSystem;
