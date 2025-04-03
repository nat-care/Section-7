import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./selectPages.css";
import NavbarWK from "../../NavbarWoker/navbarWorker";

// แผนผังหน้าและบทบาทที่เข้าถึงได้
const pages = [
  {
    id: "PR7889909",
    text: "การจัดทำใบขอซื้อ",
    engText: "Purchase Requisition - PR",
    path: "/form/pr",
    roles: ["Procurement Officer"],
  },
  {
    id: "PR5429881",
    text: "การจัดทำใบสั่งซื้อ",
    engText: "Purchase Order - PO",
    path: "/form/po",
    roles: ["Procurement Officer"],
  },
  {
    id: "PR0223981",
    text: "ใบรับพัสดุ",
    engText: "Delivery Receipt",
    path: "/form/dr",
    roles: ["Procurement Officer"],
  },
  {
    id: "PR7889909",
    text: "ใบส่งของ",
    engText: "Shipping Note",
    path: "/form/sn",
    roles: ["Procurement Officer"],
  },
  {
    id: "PR5429881",
    text: "ใบกำกับแจ้งหนี้",
    engText: "Invoice",
    path: "/form/iv",
    roles: ["Finance & Accounting"],
  },
  {
    id: "PR1234567",
    text: "ฟอร์มเบิกพัสดุ",
    engText: "Requisition Form",
    path: "/form/rf",
    roles: ["Procurement Officer"],
  },
  {
    id: "PR1234357",
    text: "ใบแจ้งชำระเงิน",
    engText: "Payment Form",
    path: "/form/pm",
    roles: ["Finance & Accounting"],
  },
  {
    id: "APP001",
    text: "รายการอนุมัติเอกสาร",
    engText: "Document Approvals",
    path: "/approvals",
    roles: ["Management & Approvers"],
  },
  {
    id: "APP002",
    text: "ประวัติการอนุมัติเอกสาร",
    engText: "Document Approval History",
    path: "/approval-history",
    roles: ["Management & Approvers"],
  },
];

const SelectPages = () => {
  const navigate = useNavigate();
  const [allowedPages, setAllowedPages] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "IT Administrator") {
      alert("IT Administrator ไม่สามารถเข้าหน้านี้ได้");
      navigate("/procurement");
      return;
    }

    const filtered = pages.filter((page) =>
      page.roles.includes(role)
    );

    setAllowedPages(filtered);
  }, [navigate]);

  return (
    <div>
      <NavbarWK />
      <div className="select-header-bac">
      <div className="select-container">
        <h2 className="title">หัวข้อเอกสาร</h2>
        <div className="list-container">
          {allowedPages.map((page, index) => (
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
        </div>
    </div>
  );
};

export default SelectPages;
