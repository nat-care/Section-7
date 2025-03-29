import  { useState } from 'react';
import './PR.css';

const PurchaseRequisition = () => {
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
        products: []
    });

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };
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
                    <input
                        type="date"
                        id="date-pr"
                        value={formData.datePR}
                        onChange={handleInputChange}
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
                    <input
                        type="date"
                        id="date-approval"
                        value={formData.dateApproval}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="date-approval2">วันที่:</label>
                    <input
                        type="date"
                        id="date-approval2"
                        value={formData.dateApproval2}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Action Buttons (แก้ไขคำขอ and ส่งคำขอ) */}
            <div className="buttons">
                <button type="button" id="editRequestBtn">แก้ไขคำขอ</button>
                <button type="button" id="submitRequestBtn" onClick={handleSubmit}>ส่งคำขอ</button>
            </div>
        </div>
    );
}

export default PurchaseRequisition;
