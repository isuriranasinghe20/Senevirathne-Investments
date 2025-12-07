import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnedUser = location.state?.user || null;


  const [inputs, setInputs] = useState({
    indexNo: returnedUser?.indexNo || "",
    nic: returnedUser?.nic || "",
    name: returnedUser?.name || "",
    phone: "",
    date: "",
    vehicleNumber: "",
    model: "",
    licenseDate: "",
    total: "",
    installment: "",
    period: "",
    customerType: "",
    status: "Moderate",
  });

  // File upload states (not required)
  const [documents, setDocuments] = useState({
  customerNicDocs: returnedUser?.customerNicDocs || [],
  guarantorNicDocs: returnedUser?.guarantorNicDocs || [],
  vehicleBookDocs: returnedUser?.vehicleBookDocs || [],
  vehicleLicenseDocs: returnedUser?.vehicleLicenseDocs || [],
});


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e, type) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: [...e.target.files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // -----------------------------
      // 1️⃣ Create User (without files)
      // -----------------------------
     const createRes = await axios.post("http://localhost:5000/users", {
        indexNo: inputs.indexNo,
        nic: inputs.nic,
        name: inputs.name,
        phone: inputs.phone,
        date: inputs.date,
        vehicleNumber: inputs.vehicleNumber,
        model: inputs.model,
        licenseDate: inputs.licenseDate,
        total: Number(inputs.total),
        installment: Number(inputs.installment),
        period: Number(inputs.period),
        customerType: inputs.customerType,
        status: inputs.status
      });

      const userId = createRes.data.users._id;

      // -----------------------------
      // 2️⃣ Upload Documents (optional)
      // -----------------------------
      const docTypeMap = {
        customerNicDocs: "customerNic",
        guarantorNicDocs: "guarantorNic",
        vehicleBookDocs: "vehicleBook",
        vehicleLicenseDocs: "vehicleLicense",
      };

      for (const type in documents) {
        if (documents[type].length === 0) continue; // skip if empty

        const formData = new FormData();
        documents[type].forEach((file) => formData.append("files", file));

        await axios.post(
          `http://localhost:5000/users/${userId}/upload/${docTypeMap[type]}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      alert("User added successfully!");
      navigate("/users");

    } catch (err) {
      console.log(err);
      alert("Error: Could not add user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add User</h1>

      <form onSubmit={handleSubmit}>
        <label>Index No</label>
        <input type="text" name="indexNo" value={inputs.indexNo} onChange={handleChange} required />
        <br />

        <label>NIC</label>
        <input type="text" name="nic" value={inputs.nic} onChange={handleChange} required />
        <br />

        <label>Name</label>
        <input type="text" name="name" value={inputs.name} onChange={handleChange} required />
        <br />

        <label>Phone</label>
        <input type="text" name="phone" value={inputs.phone} onChange={handleChange} required />
        <br />

        <label>Date</label>
        <input type="date" name="date" value={inputs.date} onChange={handleChange} required />
        <br />

        <label>Vehicle Number</label>
        <input type="text" name="vehicleNumber" value={inputs.vehicleNumber} onChange={handleChange} required />
        <br />

        <label>Model</label>
        <input type="text" name="model" value={inputs.model} onChange={handleChange} required />
        <br />

        <label>License Date</label>
        <input type="date" name="licenseDate" value={inputs.licenseDate} onChange={handleChange} required />
        <br />

        <label>Total Amount</label>
        <input type="number" name="total" value={inputs.total} onChange={handleChange} required />
        <br />

        <label>Monthly Installment</label>
        <input type="number" name="installment" value={inputs.installment} onChange={handleChange} required />
        <br />

        <label>Period (Months)</label>
        <input type="number" name="period" value={inputs.period} onChange={handleChange} required />
        <br />

        <label>Customer Type</label><br />
        <input
          type="radio"
          name="customerType"
          value="INSTALLMENT"
          checked={inputs.customerType === "INSTALLMENT"}
          onChange={handleChange}
        /> Installment

        <input
          type="radio"
          name="customerType"
          value="INTEREST_ONLY"
          checked={inputs.customerType === "INTEREST_ONLY"}
          onChange={handleChange}
          style={{ marginLeft: "20px" }}
        /> Interest Only
        <br /><br />

        {/* -------- OPTIONAL DOCUMENT UPLOADS -------- */}

        <label>Customer NIC Documents</label>
        <input type="file" multiple onChange={(e) => handleFileChange(e, "customerNicDocs")} />
        <br />

        <label>Guarantor NIC Documents</label>
        <input type="file" multiple onChange={(e) => handleFileChange(e, "guarantorNicDocs")} />
        <br />

        <label>Vehicle Book Documents</label>
        <input type="file" multiple onChange={(e) => handleFileChange(e, "vehicleBookDocs")} />
        <br />

        <label>Vehicle License Documents</label>
        <input type="file" multiple onChange={(e) => handleFileChange(e, "vehicleLicenseDocs")} />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddUser;
