import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./selectPages.css";

const pages = [
  {
    id: "PR7889909",
    text: "การจัดทำใบขอซื้อ",
    engText: "Purchase Requisition - PR",
    path: "/form/pr",
  },
  {
    id: "PR5429881",
    text: "การจัดทำใบสั่งซื้อ",
    engText: "Purchase Order - PO",
    path: "/form/po",
  },
  {
    id: "PR0223981",
    text: "ใบรับพัสดุ",
    engText: "Delivery Receipt",
    path: "/form/dr",
  },
  {
    id: "PR7889909",
    text: "ใบส่งของ",
    engText: "Shipping Note",
    path: "/form/sn",
  },
  {
    id: "PR5429881",
    text: "ใบกำกับแจ้งหนี้",
    engText: "Invoice",
    path: "/form/iv",
  },
  {
    id: "PR1234567",
    text: "ฟอร์มเบิกวัสดุ",
    engText: "Requisition Form",
    path: "/form/rf",
  },
];

const SelectPages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "IT Administrator") {
      alert("IT Administrator ไม่สามารถเข้าหน้านี้ได้");
      navigate("/procurement");
    }
  }, [navigate]);

  return (
    <div className="select-container">
      <h2 className="title">หัวข้อเอกสาร</h2>
      <div className="list-container">
        {pages.map((page, index) => (
          <div
            key={index}
            className="list-item"
            onClick={() => navigate(page.path)}
            style={{ cursor: "pointer" }}
          >
            <span className="arrow">▶</span>
            <span className="text">
              {page.id} {page.text} ({page.engText})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectPages;
