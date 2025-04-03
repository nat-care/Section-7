import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './PR.css';
import NavbarWK from "../../../NavbarWoker/navbarWorker";

const PR = () => {
    const navigate = useNavigate();

    const [rows, setRows] = useState([1]);
    const [products, setProducts] = useState([]); // เพื่อเก็บข้อมูลสินค้า
    const [formData, setFormData] = useState({
        name: '',
        date: new Date(),
        employeeName: '',
        employeePosition: '',
        department: '',
        section: '',
        detail: '',
        remark: '',
        approver: '',
        staff: '',
        dateApproval: '',
        dateApproval2: '',
        products: [{ item: '', quantity: '', unit: '', unitPrice: '', totalAmount: '' }]
    });

    // ดึงข้อมูลสินค้าจากฐานข้อมูล
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/products"); // API ที่ดึงข้อมูลสินค้า
                const data = await response.json();
                setProducts(data); // เก็บข้อมูลสินค้าใน state
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // ดึงข้อมูลผู้ใช้จาก localStorage และตั้งค่า
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const today = new Date().toISOString().split("T")[0]; // ใช้แค่วันที่
            setFormData(prev => ({
                ...prev,
                date: today, // ตั้งค่าวันที่เป็นวันที่ปัจจุบัน
                employeeName: user.fullname || user.username || '',
                employeePosition: user.id?.toString() || '',
                department: user.position || '',
                section: user.department || ''
            }));
        }
    }, []);

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
        setFormData(prevData => ({
            ...prevData,
            products: [...prevData.products, { item: '', quantity: '', unit: '', unitPrice: '', totalAmount: '' }]
        }));
    };

    const deleteRow = (index) => {
        // ลบแถวใน rows
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);

        // ลบแถวใน products และอัปเดต formData
        const newProducts = formData.products.filter((_, i) => i !== index);
        setFormData(prevData => ({
            ...prevData,
            products: newProducts
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };

        // ค้นหาข้อมูลสินค้าเมื่อเลือกสินค้า
        const selectedProduct = products.find(p => p.name === updatedProducts[index].item);
        if (selectedProduct) {
            updatedProducts[index].unit = selectedProduct.unit || ''; // ตั้งค่าหน่วยนับจากข้อมูลสินค้า
            updatedProducts[index].unitPrice = selectedProduct.price || ''; // ตั้งค่าราคาต่อหน่วยจากข้อมูลสินค้า
        }

        // คำนวณ totalAmount
        if (updatedProducts[index].unitPrice && updatedProducts[index].quantity) {
            updatedProducts[index].totalAmount = (
                parseFloat(updatedProducts[index].unitPrice) * parseFloat(updatedProducts[index].quantity)
            ).toFixed(2);
        } else {
            updatedProducts[index].totalAmount = '';
        }

        setFormData(prevData => ({
            ...prevData,
            products: updatedProducts
        }));
    };

    const handleSubmit = async () => {
        for (let i = 0; i < formData.products.length; i++) {
            const productName = formData.products[i].item;
            const quantityRequested = parseInt(formData.products[i].quantity);
    
            // ค้นหาข้อมูลสินค้าที่ถูกเลือกจากฐานข้อมูล
            const selectedProduct = products.find(p => p.name === productName);
            
            if (selectedProduct) {
                const remainingStock = selectedProduct.remaining_stock;
    
                // ตรวจสอบจำนวนคงเหลือสินค้า
                if (remainingStock < 10) {
                    alert(`ไม่สามารถสั่งซื้อ ${productName} ได้ เนื่องจากสต็อกคงเหลือต่ำกว่าเกณฑ์ที่กำหนด`);
                    return;
                }
    
                // ตรวจสอบการสั่งซื้อเกินเกณฑ์
                if (quantityRequested > 100) {
                    const excessQuantity = quantityRequested - 100;
                    alert(`ไม่สามารถสั่งซื้อ ${productName} ได้ เนื่องจากจำนวนสินค้ามากเกินไป ${excessQuantity} ชิ้น`);
                    return;
                }
            }
        }
        // ส่งข้อมูลไปยัง API
        const requestData = { ...formData };
        console.log('Sending data:', requestData);

        try {
            const response = await fetch('http://localhost:3000/purchase-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Purchase Request Submitted:', result);
                alert('ส่งคำขอเรียบร้อย!');
                navigate("/purchase", { state: { receiptData: formData } });
            } else {
                alert('Error submitting request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting request');
        }
    };

    const renderDatePicker = (id, selectedDate, onChange) => (
        <DatePicker
            selected={formData.date ? new Date(formData.date) : null}
            onChange={() => { }} // ไม่ให้เปลี่ยนแปลงได้
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            readOnly
        />
    );

    return (
        <>
        <NavbarWK/>
        <div className="purchase-requisition">
            <h2>การจัดทำใบขอซื้อ (Purchase Requisition - PR)</h2>

            <div className="row">
                <div className="column">
                    <label htmlFor="idPR">ID</label>
                    <input type="text" id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="column">
                    <label htmlFor="date">วันที่:</label>
                    {renderDatePicker('date', formData.date, (date) => setFormData({ ...formData, date: date }))}
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="employeeName">ชื่อพนักงาน:</label>
                    <input type="text" id="employeeName" value={formData.employeeName} readOnly />
                </div>
                <div className="column">
                    <label htmlFor="employeePosition">รหัสพนักงาน:</label>
                    <input type="text" id="employeePosition" value={formData.employeePosition} readOnly />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="department">ตำแหน่งพนักงาน:</label>
                    <input type="text" id="department" value={formData.department} readOnly />
                </div>
                <div className="column">
                    <label htmlFor="section">แผนก:</label>
                    <input type="text" id="section" value={formData.section} readOnly />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="detail">เรื่องรายละเอียด:</label>
                    <input type="text" id="detail" value={formData.detail} onChange={handleInputChange} />
                </div>
            </div>

            <h3>โปรดกรอกข้อมูลสินค้า</h3>
            <table id="productTable">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>รายการ</th>
                        <th>จำนวน</th>
                        <th>หน่วยนับ</th>
                        <th>ราคาต่อหน่วย</th>
                        <th>จำนวนเงิน</th>
                        <th>ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <select
                                    name="item"
                                    value={formData.products[index]?.item || ''}
                                    onChange={(e) => handleProductChange(index, e)}
                                    >
                                    <option value="">เลือกสินค้า</option> {/* เพิ่ม option สำหรับกรณีที่ยังไม่ได้เลือก */}
                                    {products.map((product, idx) => (
                                        <option key={idx} value={product.name}>
                                            {product.name} {/* แสดงชื่อสินค้าจากฐานข้อมูล */}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.products[index]?.quantity || ''}
                                    onChange={(e) => handleProductChange(index, e)}
                                    />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.products[index]?.unit || ''}
                                    readOnly
                                    />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="unitPrice"
                                    value={formData.products[index]?.unitPrice || ''}
                                    readOnly
                                    />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="totalAmount"
                                    value={formData.products[index]?.totalAmount || ''}
                                    readOnly
                                    />
                            </td>
                            <td>
                                {/* ปุ่มลบ */}
                                <button onClick={() => deleteRow(index)}>ลบแถว</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={addRow} id="addRowBtn">เพิ่มแถว</button>

            <div className="row">
                <div className="column">
                    <label htmlFor="remark">หมายเหตุ:</label>
                    <input type="text" id="remark" value={formData.remark} onChange={handleInputChange} />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="approver">ผู้อนุมัติฝ่ายจัดซื้อ:</label>
                    <input type="text" id="approver" value={formData.approver} onChange={handleInputChange} />
                </div>
                <div className="column">
                    <label htmlFor="staff">เจ้าหน้าที่ฝ่ายจัด:</label>
                    <input type="text" id="staff" value={formData.staff} onChange={handleInputChange} />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="dateApproval">วันที่:</label>
                    {renderDatePicker('dateApproval', formData.dateApproval, (date) => setFormData({ ...formData, dateApproval: date }))}
                </div>
                <div className="column">
                    <label htmlFor="dateApproval2">วันที่:</label>
                    {renderDatePicker('dateApproval2', formData.dateApproval2, (date) => setFormData({ ...formData, dateApproval2: date }))}
                </div>
            </div>

            <div className="actions">
                <button onClick={handleSubmit}>ส่งคำขอ</button>
            </div>
        </div>
                    </>
    );
};

// เพิ่มการ export default ที่นี่
export default PR;
