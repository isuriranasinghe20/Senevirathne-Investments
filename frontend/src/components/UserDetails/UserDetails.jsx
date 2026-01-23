import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { FaUpload } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";


function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hoveredButton, setHoveredButton] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toISOString().split("T")[0];
  };

  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        alert("User deleted successfully!");
        navigate("/users");
      } catch (err) {
        console.error(err);
        alert("Error deleting user.");
      }
    }
  };

  const uploadFiles = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    await api.post(`/users/${id}/upload/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchUser();
  };

  const deleteFile = async (type, index) => {
    try {
      await api.delete(`/users/${id}/delete-file/${type}/${index}`);
      fetchUser();
    } catch (err) {
      console.error(err);
      alert("Error deleting file");
    }
  };

  const renderFiles = (files, type) => {
    if (!files || files.length === 0)
      return <p className="text-gray-500 italic text-sm">No files uploaded</p>;

    return files.map((file, index) => {
      const filename = file?.filename || file;
      return (
        <div key={index} className="flex items-center gap-2 mb-2">
          <a
            href={`${api.defaults.baseURL}/uploads/${filename}`}
            download
            className="text-blue-700 font-medium text-sm hover:underline"
          >
            {filename}
          </a>
          <button
            onClick={() => deleteFile(type, index)}
            className="bg-red-400 hover:bg-red-600 text-white p-1 rounded flex items-center justify-center transition"
          >
            <RiDeleteBin6Fill size={18} />
          </button>
        </div>
      );
    });
  };

  if (!user)
    return <h2 className="text-center text-blue-700 mt-10">Loading...</h2>;

  return (
    <div className="font-sans bg-linear-to-br from-blue-100 to-blue-200 p-5 min-h-screen">

      {/* Floating Header */}
      <div className="max-w-3xl mx-auto mt-6 p-5 flex flex-col items-center bg-white bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-200 shadow-lg relative">
        {/* Gradient Border */}
        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-blue-200 via-blue-100 to-blue-200 bg-size-[300%_300%] animate-[gradientBorder_6s_ease_infinite] z-[-1] filter blur-sm"></div>

        <div className="flex items-center gap-3 justify-center">
          <FaUserEdit className="text-3xl text-blue-700" />
          <h1 className="text-lg font-bold text-blue-700 m-0">
            Customer Details
          </h1>
        </div>
        <p className="text-sm text-blue-700 opacity-70 mt-1">
          Review and manage customer information.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6 mb-12">
        {/* User Info Grid */}
        <div className="flex flex-wrap gap-3 justify-between">
          {[
            ["Index No", user.indexNo],
            ["NIC", user.nic],
            ["Name", user.name],
            ["Telephone No", user.phone],
            ["Date", formatDate(user.date)],
            ["Vehicle No", user.vehicleNumber],
            ["Model", user.model],
            ["License Expiry Date", formatDate(user.licenseDate)],
            ["Total Amount", user.total],
            ["Monthly Installment", user.installment],
            ["Period", user.period],
            ["Customer Type", user.customerType],
          ].map(([label, value], i) => (
            <div key={i} className="flex-1 min-w-[45%] bg-blue-100 rounded p-3">
              <strong className="text-blue-900">{label}:</strong>{" "}
              <span className="text-blue-800">{value}</span>
            </div>
          ))}
        </div>

        {/* Edit Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(`/users/${id}`)}
            onMouseEnter={() => setHoveredButton("edit")}
            onMouseLeave={() => setHoveredButton("")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-sm transition-shadow ${
              hoveredButton === "edit"
                ? "bg-blue-500 shadow-lg"
                : "bg-blue-400 shadow-md"
            } text-white`}
          >
            <TbEdit size={19} />
            Edit Details
          </button>
        </div>

        {/* File Upload Sections */}
        {[
          { title: "Customer NIC", type: "customerNic", files: user.customerNicDocs },
          { title: "Guarantor NIC", type: "guarantorNic", files: user.guarantorNicDocs },
          { title: "Vehicle Book", type: "vehicleBook", files: user.vehicleBookDocs },
          { title: "Vehicle License", type: "vehicleLicense", files: user.vehicleLicenseDocs },
        ].map((section, i) => (
          <div key={i} className="mt-9">
            <h2 className="text-blue-700 text-lg border-b-2 border-blue-300 pb-1">
              {section.title}
            </h2>

            <label
              className="inline-flex items-center gap-2 bg-blue-300 hover:bg-blue-400 text-white px-3 py-1 rounded mt-2 mb-2 font-medium cursor-pointer transition"
            >
              <FaUpload size={14} />
              Upload Files
              <input
                type="file"
                multiple
                onChange={(e) => uploadFiles(e, section.type)}
                className="hidden"
              />
            </label>

            {renderFiles(section.files, section.type)}
          </div>
        ))}

        {/* Delete Button */}
        <div className="mt-10 text-center">
          <button
            onClick={deleteHandler}
            onMouseEnter={() => setHoveredButton("delete")}
            onMouseLeave={() => setHoveredButton("")}
            className={`px-4 py-2 rounded-full font-bold text-white transition-shadow ${
              hoveredButton === "delete"
                ? "bg-red-600 shadow-lg"
                : "bg-red-400 shadow-md"
            }`}
          >
            Delete Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
