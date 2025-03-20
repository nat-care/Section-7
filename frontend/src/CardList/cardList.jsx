import "./cardList.css";

const users = [
  { id: "ID123456-01", name: "xxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { id: "ID234567-02", name: "xxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { id: "ID345678-03", name: "xxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { id: "ID456789-04", name: "xxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { id: "ID567890-05", name: "xxxxxxxxxxxxxxxxxxxxxxxxxx" },
];

const App = () => {
  return (
    <div className="container">
      <div className="content">
        <h1 className="header">Warehouse Procurement System</h1>
        <div className="user-list">
          {users.map((user, index) => (
            <div className="user-card" key={index}>
              <div className="user-info">
                <span className="user-icon">👤</span>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-id">{user.id}</span>
                </div>
              </div>
              <select className="dropdown">
                <option>✔</option>
              </select>
            </div>
          ))}
        </div>
        <button className="submit-btn">ยืนยัน</button>
      </div>
    </div>
  );
};

export default App;
