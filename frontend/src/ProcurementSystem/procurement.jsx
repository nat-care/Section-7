
import "./procurement.css";

const ProcurementSystem = () => {
  const data = [
    { id: "45546xxx", code: "PR788909", description: "ใบจัดซื้อสินค้าภายใน", status: "green" },
    { id: "45546xxx", code: "PR5429881", description: "ใบจัดซื้อสินค้าอุปกรณ์", status: "green" },
    { id: "45546xxx", code: "PR5429881", description: "ใบสั่งซื้อสินค้าxxxx", status: "orange" },
    { id: "45546xxx", code: "PR788909", description: "ใบรับพัสดุสินค้าxxxx", status: "orange" },
    { id: "45546xxx", code: "PR0223981", description: "ใบสั่งซื้อสินค้าxxxx", status: "orange" },
    { id: "45546xxx", code: "PR0223981", description: "ใบครบสินค้า", status: "red" },
  ];

  return (
    <div className="container">
      <div className="box">
        <h2 className="title">Warehouse Procurement System</h2>
        <div>
          {data.map((item, index) => (
            <div key={index} className="list-item">
              <span className="text-id">{item.id}</span>
              <span className="text-code">{item.code}</span>
              <span className="text-description">{item.description}</span>
              <div className={`status-circle ${item.status}`} />
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