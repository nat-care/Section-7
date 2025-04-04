import { useState, useEffect } from 'react';
import NavbarWK from "../../../NavbarWoker/navbarWorker";
import './DAHistory.css';

const DocumentApprovalHistory = () => {
  const [approvals, setApprovals] = useState([]);

  // ดึงข้อมูลจาก API หรือฐานข้อมูล
  useEffect(() => {
    // รดึงข้อมูลจาก API
    fetch('http://localhost:3000/documents/approve') 
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
