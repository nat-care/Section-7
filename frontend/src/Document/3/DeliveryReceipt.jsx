import { useLocation } from "react-router-dom";
import "./DeliveryReceipt.css";
import html2pdf from "html2pdf.js";

const DeliveryReceipt = () => {
  const location = useLocation();
  const receiptData = location.state?.receiptData || {
    idDR: "",
    drNo: "", 
    dateDR: "", 
    employeePosition: "", 
    EmployeeID: "",
    department: "", 
    products: [],
    goodsDetails: "", 
    dueDate: "", 
    deliveryDate: "", 
    checkGoodsDetail: "", 
    receiveGoodsDate: "", 
    additionalDetails: "", 
    remarks: "", 
    sender: "", 
    receiver: "", 
    approvalDate: "", 
    approvalDate2: "", 
  };

  const generatePDF = () => {
    const element = document.getElementById("delivery-receipt-content");
    const opt = {
      margin: 0.5,
      filename: "delivery_receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <div className="delivery-receipt-page">
        <div
          className="delivery-receipt-container"
          id="delivery-receipt-content"
        >
          <h2 className="delivery-receipt-title">ใบรับพัสดุ</h2>

          <div className="delivery-receipt-info">
            <p>ID-PR.NO.: {receiptData.idDR}</p>
            <p>DR.NO.: {receiptData.drNo}</p>
            <p>วันที่: {receiptData.dateDR}</p>
            <p>รหัสพนักงาน: {receiptData.employeeID}</p>
            <p>ตำแหน่ง: {receiptData.position}</p>
            <p>แผนก: {receiptData.department} </p>
            <p>รายละเอียด: {receiptData.additionalDetails}</p>
            <p>ตามสินค้า: {receiptData.goodsDetails}</p>
            <p>วันที่ครบกำหนด: {receiptData.dueDate}</p>
            <p>วันที่ส่งมอบสินค้า: {receiptData.deliveryDate}</p>
            <p>ตรวจรับสินค้าตาม: {receiptData.checkGoodsDetail}</p>
            <p>ได้รับสินค้า: {receiptData.receiveGoodsDate}</p>
          </div>

          <p className="delivery-receipt-subtitle">รายละเอียด</p>
          <table className="delivery-receipt-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>รายการ</th>
                <th>จำนวน</th>
                <th>หน่วยนับ</th>
                <th>ราคาต่อหน่วย</th>
                <th>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="delivery-receipt-note">หมายเหตุ: {receiptData.note}</p>

          <div className="delivery-receipt-signatures">
            <div className="delivery-receipt-signature">
              ผู้ส่งพัสดุ <br /> {receiptData.sender}
              <br />
              วันที่: {receiptData.approvalDate}
            </div>
            <div className="delivery-receipt-signature">
              ผู้รับพัสดุ <br /> {receiptData.receiver}
              <br />
              วันที่: {receiptData.approvalDate2}
            </div>
          </div>
        </div>
      </div>

      <div className="delivery-receipt-button-container">
        <button onClick={generatePDF} className="delivery-receipt-button">
          บันทึกเป็น PDF
        </button>
      </div>
    </>
  );
};

export default DeliveryReceipt;
