import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 หน้าเริ่มต้นระบบ
import Home from "./Home";
import Login from "./Login/login";
import ProcurementSystem from "./ProcurementSystem/procurement";
import CardList from "./CardList/cardList";
import SelectPages from "./SelectPages/selectPages";

// 🔹 ฟอร์มเอกสารหลักจาก Document/1-6
import PurchaseRequisition from "./Document/1/PurchaseRequisition";
import PurchaseOrder from "./Document/2/PurchaseOrder";
import DeliveryReceipt from "./Document/3/DeliveryReceipt";
import ShippingNote from "./Document/4/ShippingNote";
import RequisitionForm from "./Document/5/RequisitionForm";
import Invoice from "./Document/6/Invoice";

// 🔹 ฟอร์มจาก FormPage (ทดสอบ/เสริม)
import PR from "./Document/FormPage/PR";
import PO from "./Document/FormPage/PO";
import DR from "./Document/FormPage/DR";
import SN from "./Document/FormPage/SN";
import IV from "./Document/FormPage/IV";
import DA from './Document/FormPage/DA'; // ตัวอย่างการเชื่อมโยงหน้า Document Approvals
import DAHistory from './Document/FormPage/DAHistory'; // ตัวอย่างการเชื่อมโยงหน้า Document Approval History
import RF from "./Document/FormPage/RF";
import PM from "./Document/paymentForm/PM";
import PaymentList from "./Document/paymentForm/PaymentList";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🔹 หน้าเข้าสู่ระบบ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 🔹 หน้าหลังเข้าสู่ระบบ */}
        <Route path="/selectpages" element={<SelectPages />} />
        <Route path="/procurement" element={<ProcurementSystem />} />
        <Route path="/cardlist" element={<CardList />} />

        {/* 🔹 เอกสารหลัก (Document/1-6) */}
        <Route path="/purchase" element={<PurchaseRequisition />} />
        <Route path="/purchase-orders" element={<PurchaseOrder />} />
        <Route path="/delivery-receipts" element={<DeliveryReceipt />} />
        <Route path="/shipping-notes" element={<ShippingNote />} />
        <Route path="/requisition-forms" element={<RequisitionForm />} />
        <Route path="/invoices" element={<Invoice />} />

        {/* 🔹 ทดสอบ FormPage แยก */}
        <Route path="/form/pr" element={<PR />} />
        <Route path="/form/po" element={<PO />} />
        <Route path="/form/dr" element={<DR />} />
        <Route path="/form/sn" element={<SN />} />
        <Route path="/form/iv" element={<IV />} />
        <Route path="/approvals" element={<DA />} />
        <Route path="/approval-history" element={<DAHistory />} />
        <Route path="/form/rf" element={<RF />} />
        <Route path="/form/pm" element={<PM />} />
        <Route path="/form/payment-list" element={<PaymentList />} />
        <Route path="/receipt/pr/:id" element={<PurchaseRequisition />} />
        <Route path="/receipt/po/:id" element={<PurchaseOrder />} />


      </Routes>
    </Router>
  );
};

export default App;
