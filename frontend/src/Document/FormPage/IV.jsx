import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IV.css";

const IV = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    companyThatMustPay: "",
    detail: "",
    products: [],
    totalAmount: "",
    vat: "",
    netAmount: "",
    payment: "",
    notes: "",
    companyName: "",
    companyAddress: "",
    companyAddress2: "",
    taxID: "",
    email1: "",
    email2: "",
    penalty: "",
    approver: "",
    staff: "",
    dateApproval: "",
    dateApproval2: "",
  });

  const calculateTotals = () => {
    const sum = formData.products.reduce((acc, p) => acc + (parseFloat(p.totalAmount) || 0), 0);
    const vat = sum * 0.07;
    const net = sum + vat;

    setFormData((prev) => ({
      ...prev,
      totalAmount: sum.toFixed(2),
      vat: vat.toFixed(2),
      netAmount: net.toFixed(2),
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.products]);

  useEffect(() => {
    const fetchPOData = async () => {
      if (!formData.name) return;
      try {
        const res = await fetch("http://localhost:3000/purchase-orders");
        const data = await res.json();
        const matched = Array.isArray(data) ? data.find((po) => po.name === formData.name) : null;

        if (matched) {
          setFormData((prev) => ({
            ...prev,
            products: matched.products || [],
            totalAmount: matched.totalAmount?.toFixed(2) || "",
            vat: matched.vat?.toFixed(2) || "",
            netAmount: matched.netAmount?.toFixed(2) || "",
            payment: matched.payment || "",
            detail: matched.detail || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    };
    fetchPOData();
  }, [formData.name]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev.products];
      const qty = name === "quantity" ? parseFloat(value) || 0 : parseFloat(updated[index].quantity) || 0;
      const unitPrice = name === "unitPrice" ? parseFloat(value) || 0 : parseFloat(updated[index].unitPrice) || 0;

      updated[index] = {
        ...updated[index],
        [name]: value,
        totalAmount:
          name === "quantity" || name === "unitPrice"
            ? (qty * unitPrice).toFixed(2)
            : updated[index].totalAmount,
      };

      return { ...prev, products: updated };
    });
  };

  const handleSubmit = async () => {
    const required = ["name", "companyThatMustPay", "detail", "totalAmount", "vat", "netAmount", "payment"];
    for (let field of required) {
      if (!formData[field]) {
        alert(`Missing: ${field}`);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:3000/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("ส่งคำขอเรียบร้อย!");
        navigate("/invoices");
      } else {
        console.error("Error status:", res.status);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <div>{/* ฟอร์มแสดงผล */}</div>;
};

export default IV;
