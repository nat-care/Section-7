import { useState } from 'react';
import DatePicker from 'react-datepicker'; // Importing DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import the required styles
import './PR.css';

const PR = () => {
    const [rows, setRows] = useState([1]); // Initial row
    const [formData, setFormData] = useState({
        idPR: '',
        datePR: '',
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

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
        setFormData((prevData) => ({
            ...prevData,
            products: [...prevData.products, { item: '', quantity: '', unit: '', unitPrice: '', totalAmount: '' }]
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };

        // Calculate totalAmount for the product
        if (updatedProducts[index].unitPrice && updatedProducts[index].quantity) {
            updatedProducts[index].totalAmount = (
                parseFloat(updatedProducts[index].unitPrice) * parseFloat(updatedProducts[index].quantity)
            ).toFixed(2);
        } else {
            updatedProducts[index].totalAmount = ''; // Reset if no quantity or unitPrice
        }

        setFormData((prevData) => ({
            ...prevData,
            products: updatedProducts
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3000/purchase-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: 1, // Add the actual user ID here
                    dept: formData.department,
                    position: formData.employeePosition,
                    subject: formData.detail,
                    list: formData.products.map(product => product.item),
                    quantity: formData.products.map(product => product.quantity),
                    counting_unit: formData.products.map(product => product.unit),
                    unit_price: formData.products.map(product => product.unitPrice),
                    total_amount: formData.products.map(product => product.totalAmount)
                })
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Purchase Request Submitted:', result);
                alert('ส่งคำขอเรียบร้อย!');
            } else {
                alert('Error submitting request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting request');
        }
    };

    return (
        <div className="purchase-requisition">
            <h2>การจัดทำใบขอซื้อ (Purchase Requisition - PR)</h2>

            {/* Form Section */}
            <div className="row">
                <div className="column">
                    <label htmlFor="id-pr">ID-PR/NO:</label>
                    <input
                        type="text"
                        id="id-pr"
                        value={formData.idPR}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="date-pr">วันที่:</label>
                    <DatePicker
                        selected={formData.datePR ? new Date(formData.datePR) : null}
                        onChange={(date) => setFormData({ ...formData, datePR: date })}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                    />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="employee-name">ชื่อพนักงาน:</label>
                    <input
                        type="text"
                        id="employee-name"
                        value={formData.employeeName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="employee-position">ตำแหน่งพนักงาน:</label>
                    <input
                        type="text"
                        id="employee-position"
                        value={formData.employeePosition}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="department">ฝ่ายงานที่:</label>
                    <input
                        type="text"
                        id="department"
                        value={formData.department}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="section">แผนก:</label>
                    <input
                        type="text"
                        id="section"
                        value={formData.section}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="detail">เรื่องรายละเอียด:</label>
                    <input
                        type="text"
                        id="detail"
                        value={formData.detail}
                        onChange={handleInputChange}
                    />
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
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row}</td>
                            <td>
                                <input
                                    type="text"
                                    name="item"
                                    value={formData.products[index]?.item || ''}
                                    onChange={(e) => handleProductChange(index, e)}
                                />
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
                                    onChange={(e) => handleProductChange(index, e)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="unitPrice"
                                    value={formData.products[index]?.unitPrice || ''}
                                    onChange={(e) => handleProductChange(index, e)}
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
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Row Button */}
            <button onClick={addRow} id="addRowBtn">เพิ่มแถว</button>

            {/* หมายเหตุ input */}
            <div className="row">
                <div className="column">
                    <label htmlFor="remark">หมายเหตุ:</label>
                    <input
                        type="text"
                        id="remark"
                        value={formData.remark}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* ผู้อนุมัติฝ่ายจัดซื้อ and others */}
            <div className="row">
                <div className="column">
                    <label htmlFor="approver">ผู้อนุมัติฝ่ายจัดซื้อ:</label>
                    <input
                        type="text"
                        id="approver"
                        value={formData.approver}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="staff">เจ้าหน้าที่ฝ่ายจัด:</label>
                    <input
                        type="text"
                        id="staff"
                        value={formData.staff}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="date-approval">วันที่:</label>
                    <DatePicker
                        selected={formData.dateApproval ? new Date(formData.dateApproval) : null}
                        onChange={(date) => setFormData({ ...formData, dateApproval: date })}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                    />
                </div>
                <div className="column">
                    <label htmlFor="date-approval2">วันที่:</label>
                    <DatePicker
                        selected={formData.dateApproval2 ? new Date(formData.dateApproval2) : null}
                        onChange={(date) => setFormData({ ...formData, dateApproval2: date })}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                    />
                </div>
            </div>

            {/* Action Buttons (Save and Submit) */}
            <div className="actions">
                <button onClick={handleSubmit}>ส่งคำขอ</button>
                <button>บันทึก</button>
            </div>
        </div>
    );
};

export default PR;
