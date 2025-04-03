import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DA.css'; // สไตล์สำหรับหน้า DA
import NavbarWK from "../../../NavbarWoker/navbarWorker";
import { checkAndCreatePurchaseRequests } from '../FormPage/PRauto'; 

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
                            name:  order.name,
                            status: order.status,
                            type: "Purchase Order",
                        })),
                    ...purchaseRequests.map((request) => ({
                        id: request.id,
                        name: request.name,
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
                headers: { "Content-Type": "application/json" },
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
            console.error("❌ เกิดข้อผิดพลาด:", err);
        }
    };

    const updateStockAfterPurchase = async (products) => {
        try {
            for (const item of products) {
                const response = await fetch(`http://localhost:3000/products`);
                const allProducts = await response.json();
    
                const targetProduct = allProducts.find(p => p.name === item.item);
    
                if (targetProduct) {
                    const updatedStock = targetProduct.remaining_stock - Number(item.quantity);
    
                    await fetch(`http://localhost:3000/products/${targetProduct.product_id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...targetProduct,
                            remaining_stock: updatedStock
                        }),
                    });
    
                    console.log(`📦 อัปเดต stock สำหรับ ${item.item} เหลือ ${updatedStock}`);
                }
            }
        } catch (error) {
            console.error("❌ ไม่สามารถอัปเดต stock ได้:", error);
        }
    };

    const handleApprove = async (doc) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่จะอนุมัติ ${doc.name}?`)) {
            await updateStatus(doc, "Approved");
    
            // ถ้าเป็นใบสั่งซื้อ ให้ดึงรายการ products และอัปเดต stock
            if (doc.type === "Purchase Order") {
                try {
                    const res = await fetch(`http://localhost:3000/purchase-orders/${doc.id}`);
                    const poData = await res.json();
                    await updateStockAfterPurchase(poData.products);
                } catch (err) {
                    console.error("❌ ดึงข้อมูล PO ไม่สำเร็จ:", err);
                }
            }
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
        <div>
            <NavbarWK />
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
        </div>
    );
};

export default DA;
