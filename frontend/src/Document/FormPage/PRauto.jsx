// autoPR.js

export const checkAndCreatePurchaseRequests = async (setDocuments) => {
    try {
      const productResponse = await fetch("http://localhost:3000/products");
      const products = await productResponse.json();

      const prResponse = await fetch("http://localhost:3000/purchase-requests");
      const purchaseRequests = await prResponse.json();

      const lowStockProducts = products.filter(product => product.remaining_stock < 10);

      for (const product of lowStockProducts) {
        const hasExistingPR = purchaseRequests.some(pr =>
          pr.products.some(p => p.item === product.name) && pr.status === "Pending"
        );

        if (!hasExistingPR) {
          await createPurchaseRequest(product, setDocuments);
        } else {
          console.log(`✅ ข้าม PR สำหรับ ${product.name} (มีอยู่แล้ว)`);
        }
      }
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการตรวจสอบสินค้า:", error);
    }
};

const createPurchaseRequest = async (product, setDocuments) => {
    try {
      const response = await fetch("http://localhost:3000/purchase-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `PR-${product.name}`,
          date: new Date().toISOString().slice(0, 10),
          employeeName: "Auto System",
          employeePosition: "System",
          department: "Procurement",
          section: "Auto-Gen",
          detail: `Auto-generated PR for ${product.name}`,
          remark: "",
          approver: "",
          staff: "",
          dateApproval: "",
          dateApproval2: "",
          products: [
            {
              item: product.name,
              quantity: 10,
              unit: product.unit,
              unitPrice: product.price,
              totalAmount: (10 * product.price).toFixed(2)
            }
          ],
          status: "Pending"
        })
      });

      if (response.ok) {
        const newPR = await response.json();
        console.log(`📝 สร้าง PR สำเร็จ: ${newPR.name}`);

        setDocuments(prev => [
          ...prev,
          {
            id: newPR.id,
            name: newPR.name,
            status: newPR.status,
            type: "Purchase Request"
          }
        ]);
      } else {
        console.error("❌ ไม่สามารถสร้างใบขอซื้อได้");
      }
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดตอนสร้างใบขอซื้อ:", error);
    }
};

// DocumentApprovalHistory.jsx

import { useState, useEffect } from 'react';
import NavbarWK from "../../../NavbarWoker/navbarWorker";

const DocumentApprovalHistory = () => {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
   fetch("http://localhost:3000/documents/approve")
      .then(response => response.json())
      .then(data => setApprovals(data))
      .catch(error => console.error('Error fetching approval data:', error));
  }, []);

  return (
    <>
      <NavbarWK />
      <div className="approval-history">
        <h2>ประวัติการอนุมัติเอกสาร</h2>
        <table>
          <thead>
            <tr>
              <th>รหัสเอกสาร</th>
              <th>วันที่อนุมัติ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {approvals.length > 0 ? (
              approvals.map(approval => (
                <tr key={approval.id}>
                  <td>{approval.documentId}</td>
                  <td>{new Date(approval.approvalDate).toLocaleDateString()}</td>
                  <td>
                    {approval.status === 'approved' ? (
                      <span className="approved">อนุมัติ</span>
                    ) : approval.status === 'rejected' ? (
                      <span className="rejected">ยกเลิก</span>
                    ) : (
                      <span className="pending">รออนุมัติ</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentApprovalHistory;