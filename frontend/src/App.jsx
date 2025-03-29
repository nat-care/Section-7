import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/login";
// import PurchaseForm from "./PurchaseForm/purchaseForm"; 
import ProcurementSystem from "./ProcurementSystem/procurement"; 
import CardList from "./CardList/cardList";
import SelectPages from "./SelectPages/selectPages";

import PurchaseRequisition from "./Document/1/PurchaseRequisition";
import PurchaseOrder from "./Document/2/PurchaseOrder";
import DeliveryReceipt from "./Document/3/DeliveryReceipt";
import ShippingNote from "./Document/4/ShippingNote";
import RequisitionForm from "./Document/5/RequisitionForm";
import Invoice from "./Document/6/Invoice";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selectpages" element={<SelectPages />} />
        <Route path="/purchase" element={<PurchaseRequisition />} />
        <Route path="/purchase-orders" element={<PurchaseOrder />} />
        <Route path="/delivery-receipts" element={<DeliveryReceipt />} />
        <Route path="/shipping-notes" element={<ShippingNote />} />
        <Route path="/requisition-forms" element={<RequisitionForm />} />
        <Route path="/invoices" element={<Invoice />} />
        <Route path="/procurement" element={<ProcurementSystem />} />
        <Route path="/cardlist" element={<CardList />} />
      </Routes>
    </Router>
  );
};

export default App;
