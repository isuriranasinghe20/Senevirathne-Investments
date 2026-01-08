import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";

function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnedUser = location.state?.user || null;

  const [inputs, setInputs] = useState({
    indexNo: returnedUser?.indexNo || "",
    nic: returnedUser?.nic || "",
    name: returnedUser?.name || "",
    phone: returnedUser?.phone || "",
    date: returnedUser?.date || "",
    vehicleNumber: returnedUser?.vehicleNumber || "",
    model: returnedUser?.model || "",
    licenseDate: returnedUser?.licenseDate || "",
    total: returnedUser?.total || "",
    installment: returnedUser?.installment || "",
    period: returnedUser?.period || "",
    customerType: returnedUser?.customerType || "",
    status: returnedUser?.status || "Moderate",
  });

  const [documents, setDocuments] = useState({
    customerNicDocs: [],
    guarantorNicDocs: [],
    vehicleBookDocs: [],
    vehicleLicenseDocs: [],
  });

  const [hoverButton, setHoverButton] = useState("");
  const [hoverInput, setHoverInput] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showAlert = (message, type = "success", redirectPath = null) => {
    setAlert({ message, type });
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
    setTimeout(() => setAlert({ message: "", type: "" }), 3500);
    if (redirectPath) setTimeout(() => navigate(redirectPath), 1500);
  };

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e, type) => {
    if (!e.target.files) return;
    setDocuments((prev) => ({ ...prev, [type]: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createRes = await axios.post("http://localhost:5000/users", {
        ...inputs,
        total: Number(inputs.total),
        installment: Number(inputs.installment),
        period: Number(inputs.period),
        existingDocs: returnedUser
          ? {
              customerNicDocs: returnedUser.customerNicDocs || [],
              guarantorNicDocs: returnedUser.guarantorNicDocs || [],
              vehicleBookDocs: returnedUser.vehicleBookDocs || [],
              vehicleLicenseDocs: returnedUser.vehicleLicenseDocs || [],
            }
          : {},
      });

      const userId = createRes.data.user._id;

      const docTypeMap = {
        customerNicDocs: "customerNic",
        guarantorNicDocs: "guarantorNic",
        vehicleBookDocs: "vehicleBook",
        vehicleLicenseDocs: "vehicleLicense",
      };

      for (const key in documents) {
        const filesArray = documents[key];
        if (!filesArray || filesArray.length === 0) continue;

        const formData = new FormData();
        filesArray.forEach((file) => formData.append("files", file));

        await axios.post(
          `http://localhost:5000/users/${userId}/upload/${docTypeMap[key]}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      showAlert("Customer added successfully!", "success", "/users");
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert("Error: Could not add customer", "error");
    }
  };

  const renderExistingFiles = (key) => {
    const existing = returnedUser?.[key] || [];
    const selected = documents[key] || [];
    if (existing.length === 0 && selected.length === 0) return <p className="text-sm text-gray-500 mt-1">No files selected</p>;

    return (
      <ul className="text-sm text-blue-500 mt-1 list-disc list-inside">
        {existing.map((file, i) => (
          <li key={`existing-${i}`}>{file.filename || file}</li>
        ))}
        {selected.map((file, i) => (
          <li key={`selected-${i}`}>{file.name}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen py-4 bg-linear-to-br from-blue-100 to-blue-200 font-sans">

      {/* Floating Header */}
      <div className="relative max-w-3xl mx-4 sm:mx-auto my-6 p-6 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl border border-blue-200 shadow-lg">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-300 via-blue-100 to-blue-300 animate-gradient-border blur-sm -z-10"></div>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <IoPersonAddSharp className="text-3xl text-blue-600" />
          <h1 className="text-xl font-bold text-blue-700 text-center">
            {returnedUser ? "Edit Customer" : "Create New Customer"}
          </h1>
        </div>
        <p className="text-sm text-blue-700 opacity-70 mt-1 text-center">
          {returnedUser
            ? "Update and manage customer information."
            : "Add a new customer to the system."}
        </p>
      </div>

      {/* Form Container */}
      <div className="flex justify-center p-4 sm:p-5">
        {alert.message && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded font-medium text-center shadow-md transition-opacity z-50 ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
            style={{ opacity: alertVisible ? 1 : 0 }}
          >
            {alert.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6"
        >
          {/* Personal Info */}
          <section>
            <h2 className="border-t-2 border-blue-200 pt-4 text-lg font-semibold text-blue-800 mb-4">
              Personal Information
            </h2>
            <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {[
                { label: "Index No *", name: "indexNo", placeholder: "Enter index number" },
                { label: "NIC *", name: "nic", placeholder: "Enter NIC number" },
                { label: "Full Name *", name: "name", placeholder: "Enter full name" },
                { label: "Phone Number *", name: "phone", placeholder: "07X XXX XXXX" },
                { label: "Registration Date *", name: "date", type: "date" },
              ].map(({ label, name, placeholder, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="font-medium mb-1">{label}</label>
                  <input
                    type={type || "text"}
                    name={name}
                    value={inputs[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className={`w-full rounded-md px-3 py-2 text-gray-800 placeholder-blue-300 bg-blue-50 border ${
                      hoverInput === name ? "border-blue-500" : "border-blue-200"
                    } outline-none transition`}
                    onFocus={() => setHoverInput(name)}
                    onBlur={() => setHoverInput("")}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Vehicle Info */}
          <section>
            <h2 className="border-t-2 border-blue-200 pt-4 text-lg font-semibold text-blue-800 mb-4">
              Vehicle Information
            </h2>
            <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {[
                { label: "Vehicle Number *", name: "vehicleNumber", placeholder: "ABC-1234" },
                { label: "Model *", name: "model", placeholder: "Enter vehicle model" },
                { label: "License Date *", name: "licenseDate", type: "date" },
              ].map(({ label, name, placeholder, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="font-medium mb-1">{label}</label>
                  <input
                    type={type || "text"}
                    name={name}
                    value={inputs[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className={`w-full rounded-md px-3 py-2 text-gray-800 placeholder-blue-300 bg-blue-50 border ${
                      hoverInput === name ? "border-blue-500" : "border-blue-200"
                    } outline-none transition`}
                    onFocus={() => setHoverInput(name)}
                    onBlur={() => setHoverInput("")}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Financial Info */}
          <section>
            <h2 className="border-t-2 border-blue-200 pt-4 text-lg font-semibold text-blue-800 mb-4">
              Financial Details
            </h2>
            <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {[
                { label: "Total Amount *", name: "total", type: "number", placeholder: "Rs. 0.00" },
                { label: "Monthly Installment *", name: "installment", type: "number", placeholder: "Rs. 0.00" },
                { label: "Period (Months) *", name: "period", type: "number", placeholder: "0" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name} className="flex flex-col">
                  <label className="font-medium mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={inputs[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className={`w-full rounded-md px-3 py-2 text-gray-800 placeholder-blue-300 bg-blue-50 border ${
                      hoverInput === name ? "border-blue-500" : "border-blue-200"
                    } outline-none transition`}
                    onFocus={() => setHoverInput(name)}
                    onBlur={() => setHoverInput("")}
                  />
                </div>
              ))}
            </div>

            <label className="block mt-4 font-medium">Choose Payment Method*</label>
            <div className={`flex gap-4 mt-2 ${isMobile ? "flex-col" : "flex-row"}`}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customerType"
                  value="INSTALLMENT"
                  checked={inputs.customerType === "INSTALLMENT"}
                  onChange={handleChange}
                />
                Installment
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customerType"
                  value="INTEREST_ONLY"
                  checked={inputs.customerType === "INTEREST_ONLY"}
                  onChange={handleChange}
                />
                Interest Only
              </label>
            </div>
          </section>

          {/* Document Uploads */}
          <section>
            <h2 className="border-t-2 border-blue-200 pt-4 text-lg font-semibold text-blue-800 mb-4">
              Document Uploads <span className="text-sm text-blue-500">(Optional)</span>
            </h2>
            <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {[
                ["Customer NIC Documents", "customerNicDocs"],
                ["Guarantor NIC Documents", "guarantorNicDocs"],
                ["Vehicle Book Documents", "vehicleBookDocs"],
                ["Vehicle License Documents", "vehicleLicenseDocs"],
              ].map(([label, key]) => (
                <div
                  key={key}
                  className="bg-blue-50 border border-blue-200 rounded-md p-4 flex flex-col gap-1"
                >
                  <label className="font-medium">{label}</label>
                  {renderExistingFiles(key)}
                  <label className="cursor-pointer bg-blue-400 text-white text-center px-2 py-1 rounded text-xs hover:bg-blue-700 transition w-max mt-1">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, key)}
                      className="hidden"
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Buttons */}
          <div
            className={`flex gap-4 pt-6 border-t border-blue-300 mt-6 ${
              isMobile ? "flex-col-reverse items-center" : "flex-row justify-center"
            }`}
          >
            <button
              type="button"
              onClick={() => navigate("/users")}
              onMouseEnter={() => setHoverButton("cancel")}
              onMouseLeave={() => setHoverButton("")}
              className={`flex-1 max-w-xs px-15.5 py-3 rounded font-semibold text-blue-900 border text-center transition ${
                hoverButton === "cancel" ? "bg-gray-300" : "bg-gray-200"
              } border-gray-400`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onMouseEnter={() => setHoverButton("submit")}
              onMouseLeave={() => setHoverButton("")}
              className={`flex-1 max-w-xs px-6 py-3 rounded font-semibold text-white text-center transition ${
                hoverButton === "submit" ? "bg-blue-900 shadow-lg" : "bg-blue-600 shadow-md"
              }`}
            >
              {returnedUser ? "Update Customer" : "Submit Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
