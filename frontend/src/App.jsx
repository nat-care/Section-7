import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/login";
import PurchaseForm from "./PurchaseForm/purchaseForm"; // ✅ Ensure the correct path
import ProcurementSystem from "./ProcurementSystem/procurementSystem"; // ✅ Ensure the correct path

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/purchase" element={<PurchaseForm />} />
        <Route path="/ProcurementSystem" element={<ProcurementSystem />} />
      </Routes>
    </Router>
  );
};

export default App;