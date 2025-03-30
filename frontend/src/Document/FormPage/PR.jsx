import { useState } from 'react';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 
import './PR.css';

const PR = () => {
    const [rows, setRows] = useState([1]); 
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
        setFormData(prevData => ({
            ...prevData,
            products: [...prevData.products, { item: '', quantity: '', unit: '', unitPrice: '', totalAmount: '' }]
        }));
    };

    const deleteRow = (index) => {
        // Remove the row from the `rows` array
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);

        // Remove the corresponding product from the `products` array
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

        // Calculate totalAmount for the product
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
        console.log('Sending data:', {
            user_id: 1,
            dept: formData.department,
            position: formData.employeePosition,
            subject: formData.detail,
            list: formData.products.map(product => product.item),
            quantity: formData.products.map(product => product.quantity),
            counting_unit: formData.products.map(product => product.unit),
            unit_price: formData.products.map(product => product.unitPrice),
            total_amount: formData.products.map(product => product.totalAmount)
        });
    
        try {
            const response = await fetch('http://localhost:3000/purchase-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: 1, 
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
    

    const renderDatePicker = (id, selectedDate, onChange) => (
        <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={onChange}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
        />
    );

    return (
        <div className="purchase-requisition">
            <h2>การจัดทำใบขอซื้อ (Purchase Requisition - PR)</h2>

            {/* Form Section */}
            <div className="row">
                <div className="column">
                    <label htmlFor="idPR">ID-PR/NO:</label>
                    <input
                        type="text"
                        id="idPR"
                        value={formData.idPR}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="datePR">วันที่:</label>
                    {renderDatePicker('datePR', formData.datePR, (date) => setFormData({ ...formData, datePR: date }))}
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="employeeName">ชื่อพนักงาน:</label>
                    <input
                        type="text"
                        id="employeeName"
                        value={formData.employeeName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="column">
                    <label htmlFor="employeePosition">รหัสพนักงาน:</label>
                    <input
                        type="text"
                        id="employeePosition"
                        value={formData.employeePosition}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="column">
                    <label htmlFor="department">ตำแหน่งพนักงาน:</label>
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
                        <th>ลบ</th>
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
                            <td>
                                <button onClick={() => deleteRow(index)}>ลบแถว</button>
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
                    {renderDatePicker('date-approval', formData.dateApproval, (date) => setFormData({ ...formData, dateApproval: date }))}
                </div>
                <div className="column">
                    <label htmlFor="date-approval2">วันที่:</label>
                    {renderDatePicker('date-approval2', formData.dateApproval2, (date) => setFormData({ ...formData, dateApproval2: date }))}
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
