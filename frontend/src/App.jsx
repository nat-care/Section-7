import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/login";
import PurchaseForm from "./PurchaseForm/purchaseForm"; 
import ProcurementSystem from "./ProcurementSystem/procurementSystem"; 
import CardList from "./CardList/cardList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/purchase" element={<PurchaseForm />} />
        <Route path="/ProcurementSystem" element={<ProcurementSystem />} />
        <Route path="/cardlist" element={<CardList />} />
      </Routes>
    </Router>
  );
};

export default App;