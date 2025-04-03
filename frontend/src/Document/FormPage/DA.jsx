import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DA.css'; // สไตล์สำหรับหน้า DA
import { checkAndCreatePurchaseRequests } from './autoPR';

const DA = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch("http://localhost:3000/purchase-orders");
                const purchaseOrders = await response.json();

                const purchaseRequestsResponse = await fetch("http://localhost:3000/purchase-requests");
                const purchaseRequests = await purchaseRequestsResponse.json();

                const allDocuments = [
                    ...purchaseOrders
                        .filter((order) => order.name)
                        .map((order) => ({
                            id: order.id,
                            name: "ใบสั่งซื้อ - " + order.name,
                            status: order.status,
                            type: "Purchase Order",
                        })),
                    ...purchaseRequests.map((request) => ({
                        id: request.id,
                        name: "ใบขอซื้อ - " + request.name,
                        status: request.status || "Pending",
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

    const updateStatus = async (doc, newStatus) => {
        const endpoint =
            doc.type === "Purchase Order"
                ? `http://localhost:3000/purchase-orders/${Number(doc.id)}`
                : `http://localhost:3000/purchase-requests/${Number(doc.id)}`;

        const updatedDoc = { ...doc, status: newStatus };

        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedDoc),
            });

            if (response.ok) {
                console.log(`✅ สถานะอัปเดตเป็น ${newStatus} แล้ว`);
                setDocuments((prevDocs) =>
                    prevDocs.map((d) =>
                        d.id === doc.id ? { ...d, status: newStatus } : d
                    )
                );
            } else {
                console.error("❌ ไม่สามารถอัปเดตสถานะได้");
            }
        } catch (err) {
            console.error("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ:", err);
        }
    };

    const handleApprove = (doc) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่จะอนุมัติ ${doc.name}?`)) {
            updateStatus(doc, "Approved");
        }
    };

    const handleReject = (doc) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่จะปฏิเสธ ${doc.name}?`)) {
            updateStatus(doc, "Rejected");
        }
    };

    const handleViewReceipt = (doc) => {
        if (doc.type === "Purchase Request") {
            navigate(`/receipt/pr/${doc.id}`);
        } else if (doc.type === "Purchase Order") {
            navigate(`/receipt/po/${doc.id}`);
        }
    };

    return (
        <div className="document-approvals">
            <h2>APP001 รายการอนุมัติเอกสาร (Document Approvals)</h2>

            <table className="document-table">
                <thead>
                    <tr>
                        <th>เอกสาร ID</th>
                        <th>ชื่อเอกสาร</th>
                        <th>สถานะ</th>
                        <th>ดูใบเสร็จ</th>
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
                                <button
                                    className="view-btn"
                                    onClick={() => handleViewReceipt(doc)}
                                >
                                    ดูใบเสร็จ
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleApprove(doc)} className="approve-btn">อนุมัติ</button>
                                <button onClick={() => handleReject(doc)} className="reject-btn">ปฏิเสธ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DA;
