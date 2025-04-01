
export async function checkAndCreatePR(productId) {
    const MIN_STOCK_LEVEL = 10;
    try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        if (!response.ok) throw new Error('ไม่พบสินค้า');
        
        const product = await response.json();

        if (product.stock < MIN_STOCK_LEVEL) {
            console.log(`สร้าง PR สำหรับสินค้า: ${product.name}`);
            await fetch('http://localhost:3001/api/purchase-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: MIN_STOCK_LEVEL - product.stock,
                    status: 'Pending'
                })
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function canCreatePO(productId, orderQuantity) {
    const MAX_STOCK_LEVEL = 100;
    try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        if (!response.ok) throw new Error('ไม่พบสินค้า');

        const product = await response.json();
        const newStockLevel = product.stock + orderQuantity;

        if (newStockLevel > MAX_STOCK_LEVEL) {
            console.warn(`สินค้า ${product.name} มีจำนวนในสต็อกเกินกว่าที่กำหนด ไม่สามารถจัดทำใบสั่งซื้อได้`);
            return false; // ไม่สามารถสร้าง PO ได้
        }

        return true; // สามารถสร้าง PO ได้
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}
