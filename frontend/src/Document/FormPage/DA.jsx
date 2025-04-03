import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './DA.css'; // สไตล์สำหรับหน้า DA
import { checkAndCreatePurchaseRequests } from './PRauto';

const DA = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลการอนุมัติเอกสารจาก backend (API)
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                // ดึงข้อมูลทั้งจาก purchase_orders และ purchase_requests
                const response = await fetch("http://localhost:3000/purchase-orders");
                const purchaseOrders = await response.json();

                const purchaseRequestsResponse = await fetch("http://localhost:3000/purchase-requests");
                const purchaseRequests = await purchaseRequestsResponse.json();

                // รวมข้อมูลเอกสารทั้งสองแบบ
                const allDocuments = [
                    ...purchaseOrders.map((order) => ({
                        id: order.idPO,
                        name: "ใบสั่งซื้อ - " + order.idPO,
                        status: order.status,
                        type: "Purchase Order",
                    })),
                    ...purchaseRequests.map((request) => ({
                        id: request.idPR,
                        name: "ใบขอซื้อ - " + request.idPR,
                        status: "Pending", // สถานะเริ่มต้นอาจเป็น Pending
                        type: "Purchase Request",
                    })),
                ];

                setDocuments(allDocuments);
                checkAndCreatePurchaseRequests(setDocuments);
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    // ฟังก์ชันอนุมัติเอกสาร
    const handleApprove = (docId) => {
        console.log("Approving document ID:", docId);
        // ส่งคำขออนุมัติไปที่ backend
        // ทำการเปลี่ยนสถานะเป็น "approved"
    };

    // ฟังก์ชันปฏิเสธเอกสาร
    const handleReject = (docId) => {
        console.log("Rejecting document ID:", docId);
        // ส่งคำขอปฏิเสธไปที่ backend
        // ทำการเปลี่ยนสถานะเป็น "rejected"
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="document-approvals">
            <h2>APP001 รายการอนุมัติเอกสาร (Document Approvals)</h2>

            <table className="document-table">
                <thead>
                    <tr>
                        <th>เอกสาร ID</th>
                        <th>ชื่อเอกสาร</th>
                        <th>สถานะ</th>
                        <th>การอนุมัติ</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.id}>
                            <td>{doc.id}</td>
                            <td>{doc.name}</td>
                            <td>{doc.status}</td>
                            <td>
                                <button onClick={() => handleApprove(doc.id)} className="approve-btn">อนุมัติ</button>
                                <button onClick={() => handleReject(doc.id)} className="reject-btn">ปฏิเสธ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DA;
