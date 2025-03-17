// purchaseRequest.js

export const handlePurchaseRequestSubmit = async (user_id, description, total_amount, setMessage) => {
    // ตรวจสอบค่าที่กรอก
    if (!user_id || !description || !total_amount) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/purchase-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, description, total_amount }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("เพิ่มใบขอซื้อสำเร็จ!");
      } else {
        setMessage(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      setMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };
  