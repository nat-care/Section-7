import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./PaymentList.css";

function PaymentList() {
  const navigate = useNavigate(); 

  const [invoices, setInvoices] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    // เรียก API ดึงข้อมูล invoices
    fetch("http://localhost:3000/invoices")
      .then((response) => response.json())
      .then((data) => {
        // กรองใบแจ้งชำระเงินที่ยอดรวม (totalAmount) != 0
        const filtered = data.filter((inv) => parseFloat(inv.totalAmount) !== 0);
        setInvoices(filtered);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  }, []);

  // แสดงแค่ 5 รายการแรก หากยังไม่กด "แสดงทั้งหมด"
  const visibleInvoices = showAll ? invoices : invoices.slice(0, 5);

  // ฟังก์ชันเรียกเมื่อคลิกที่แถวตาราง
  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  // ถ้ามี selectedInvoice -> แสดงหน้าแสดงรายละเอียด (PMIVDetail)
  if (selectedInvoice) {
    return (
      <PMIVDetail
        invoice={selectedInvoice}
      />
    );
  }

  // ไม่เช่นนั้น -> แสดงหน้าแสดงรายการตาราง
  return (
    <div className="payment-list-container">
      <h2>ใบค้างชำระเงิน</h2>

      <div className="payment-table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>เลขที่เอกสาร</th>
              <th>ชื่อลูกค้า</th>
              <th>ยอดรวม</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {visibleInvoices.map((inv, index) => (
              <tr
                key={inv.idIV + "_" + index}
                onClick={() => handleRowClick(inv)}
                style={{ cursor: "pointer" }} // ให้เห็นว่าแถวคลิกได้
              >
                <td>{inv.dateApproval2}</td>
                <td>{inv.idIV}</td>
                <td>{inv.companyThatMustPay}</td>
                <td>{inv.totalAmount}</td>
                <td>รอดำเนินการ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ถ้ามีรายการมากกว่า 5 และยังไม่กดแสดงทั้งหมด ให้แสดงปุ่ม */}
      {invoices.length > 5 && !showAll && (
        <button className="show-all-button" onClick={() => setShowAll(true)}>
          แสดงทั้งหมด
        </button>
      )}
      <button
        className="pm-sl-button"
        onClick={() => navigate("/selectPages")}
      >
        หน้าแรก
      </button>
    </div>
  );
}

/**
 * คอมโพเนนต์แสดงรายละเอียดใบแจ้งชำระเงิน
 * รับ props:
 *   - invoice: object ของใบแจ้งชำระเงิน
 */
function PMIVDetail({ invoice }) {
  const navigate = useNavigate();
  // สร้าง state สำหรับ "ชำระบางส่วน (แบ่งชำระ)"
  const [partialPayment, setPartialPayment] = useState("");

  // ดึงข้อมูลที่ต้องการจาก invoice
  const {
    idIV,
    companyThatMustPay,
    products,
    totalAmount,
    discount,
    vat,
    netAmount,
    notes,
  } = invoice;

  // ฟังก์ชัน parse ให้เป็นตัวเลข หรือ 0 ถ้าไม่ใช่ตัวเลข / ติดลบ
  const parseOrZero = (value) => {
    let num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      num = 0;
    }
    return num;
  };

  const discountNumber = parseOrZero(discount);
  const vatNumber = parseOrZero(vat);
  const totalNumber = parseOrZero(totalAmount);

  // ถ้า netAmount ไม่มีหรือไม่ใช่ตัวเลข จะใช้สูตร (total + vat - discount)
  let netNumber = parseFloat(netAmount);
  if (isNaN(netNumber)) {
    netNumber = totalNumber + vatNumber - discountNumber;
  }

  // คำนวณ "ชำระบางส่วน"
  const partialNumber = parseOrZero(partialPayment);

  // คำนวณ "คงเหลือ"
  const remainder = netNumber - partialNumber;

  // ฟังก์ชันสำหรับการพิมพ์ใบเสร็จ
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pmiv-detail-container">
      <h2>ใบแจ้งชำระเงิน (ใบรับชำระเงิน)</h2>
      <div className="pmiv-info">
        <p>
          <strong>เลขที่เอกสาร:</strong> {idIV}
        </p>
        <p>
          <strong>ชื่อลูกค้า:</strong> {companyThatMustPay}
        </p>
      </div>

      {/* ตารางรายการสินค้า */}
      <div className="pmiv-products-table">
        <table>
          <thead>
            <tr>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วย</th>
              <th>ราคาต่อหน่วย</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((prod, idx) => (
                <tr key={idx}>
                  <td>{prod.item}</td>
                  <td>{prod.quantity}</td>
                  <td>{prod.unit}</td>
                  <td>{prod.unitPrice}</td>
                  <td>{prod.totalAmount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ส่วนแสดงยอดรวม, ส่วนลด, VAT, netAmount */}
      <div className="pmiv-summary">
        <div className="summary-left">
          <p>
            <strong>หมายเหตุ:</strong> {notes || "-"}
          </p>
        </div>
        <div className="summary-right">
          <p>
            <strong>ยอดรวม:</strong> {totalNumber} บาท
          </p>
          <p>
            <strong>ส่วนลด:</strong> {discountNumber} บาท
          </p>
          <p>
            <strong>ภาษีมูลค่าเพิ่ม:</strong> {vatNumber} บาท
          </p>
          <p>
            <strong>ยอดสุทธิ:</strong> {netNumber} บาท
          </p>
        </div>
      </div>

      {/* ช่องกรอก "ชำระบางส่วน" และแสดง "คงเหลือ" */}
      <div className="pmiv-partial-payment">
        <label htmlFor="partialPayment">
          <strong>ชำระบางส่วน:</strong>
        </label>
        <input
          type="number"
          id="partialPayment"
          value={partialPayment}
          onChange={(e) => setPartialPayment(e.target.value)}
          placeholder="0.00"
          style={{ marginLeft: "0.5rem", width: "100px" }}
        />
      </div>
      <div className="pmiv-remainder">
        <p>
          <strong>คงเหลือ:</strong> {remainder < 0 ? 0 : remainder} บาท
        </p>
      </div>

      {/* ปุ่มสำหรับพิมพ์ใบเสร็จและกลับไปหน้าแรก */}
      <div className="pmiv-button-group">
        <button onClick={handlePrint}>พิมพ์ใบเสร็จ</button>
        <button onClick={() => navigate("/selectPages")}>หน้าแรก</button>
      </div>
    </div>
  );
}

export default PaymentList;
