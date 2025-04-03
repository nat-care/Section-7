import { Navigate } from 'react-router-dom';

// ฟังก์ชันตรวจสอบและสร้างใบขอซื้อ
export const checkAndCreatePurchaseRequests = async (setDocuments) => {
    try {
        // ดึงข้อมูลสินค้า
        const productResponse = await fetch("http://localhost:3000/products");
        const products = await productResponse.json();

        // ดึงข้อมูลใบขอซื้อที่รอดำเนินการอยู่
        const prResponse = await fetch("http://localhost:3000/purchase-requests");
        const purchaseRequests = await prResponse.json();

        // กรองสินค้าที่ต่ำกว่าเกณฑ์
        const lowStockProducts = products.filter(product => product.remaining_stock < 10);

        for (const product of lowStockProducts) {
            // ตรวจสอบว่าสินค้านี้มี PR ที่รอดำเนินการอยู่หรือไม่
            const existingPR = purchaseRequests.some(pr => pr.product_id === product.product_id && pr.status === "Pending");

            if (!existingPR) {
                await createPurchaseRequest(product, setDocuments);
            } else {
                console.log(`สินค้ารายการ ${product.name} มี PR อยู่แล้ว ข้ามการสร้างซ้ำ`);
            }
        }
    } catch (error) {
        console.error("Error checking stock levels:", error);
    }
};

// ฟังก์ชันสร้างใบขอซื้อ
const createPurchaseRequest = async (product, setDocuments, navigate) => {
    try {
        const response = await fetch("http://localhost:3000/purchase-requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_id: product.product_id,
                name: `ใบขอซื้อ - ${product.name}`,
                quantity: 10,
                status: "Pending",
                requested_by: "Procurement Officer"
            })
        });

        if (response.ok) {
            const newPR = await response.json();
            console.log(`สร้างใบขอซื้อสำเร็จ: ${newPR.name}`);

            // อัปเดตเอกสารใน State
            setDocuments(prevDocs => [...prevDocs, {
                id: newPR.idPR,
                name: newPR.name,
                status: "Pending",
                type: "Purchase Request"
            }]);

            // ส่งข้อมูลไปยัง DAHistory
            navigate('/da-history', { state: { document: newPR } });
        } else {
            console.error("Error creating purchase request");
        }
    } catch (error) {
        console.error("Error creating purchase request:", error);
    }
};
