import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./selectPages.css";

const pages = [
  {
    id: "PR7889909",
    text: "การจัดทำใบขอซื้อ",
    engText: "Purchase Requisition - PR",
    path: "/purchase",
  },
  {
    id: "PR5429881",
    text: "การจัดทำใบสั่งซื้อ",
    engText: "Purchase Order - PO",
    path: "/purchase-orders",
  },
  {
    id: "PR0223981",
    text: "ใบรับวัสดุ",
    engText: "Delivery Receipt",
    path: "/delivery-receipts",
  },
  {
    id: "PR7889909",
    text: "ใบส่งของ",
    engText: "Shipping Note",
    path: "/shipping-notes",
  },
  {
    id: "PR5429881",
    text: "ใบกำกับภาษี",
    engText: "Invoice",
    path: "/invoices",
  },
  {
    id: "PR1234567",
    text: "ฟอร์มเบิกวัสดุ",
    engText: "Requisition Form",
    path: "/requisition-forms",
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
            style={{ cursor: "pointer" }} // เพิ่มให้รู้ว่ากดได้
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
