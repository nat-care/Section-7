import "./selectPages.css";

const pages = [
  { id: "PR7889909", text: "การจัดทำใบขอซื้อ", engText: "Purchase Requisition - PR" },
  { id: "PR5429881", text: "การจัดทำใบสั่งซื้อ", engText: "Purchase Order - PO" },
  { id: "PR0223981", text: "ใบรับวัสดุ", engText: "Delivery Receipt" },
  { id: "PR7889909", text: "ใบส่งของ", engText: "Shipping Note" },
  { id: "PR5429881", text: "ใบกำกับภาษี", engText: "Invoice" }
];

const SelectPages = () => {
  return (
    <div className="select-container">
      <h2 className="title">หัวข้อเอกสาร</h2>
      <div className="list-container">
        {pages.map((page, index) => (
          <div key={index} className="list-item">
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
