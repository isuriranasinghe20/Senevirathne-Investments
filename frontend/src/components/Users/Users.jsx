import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FiFilter, FiEye, FiActivity, FiPrinter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";


const USERS_URL = "http://localhost:5000/users";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("ASC");

  // Fetch users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(USERS_URL);
        const usersData = res.data.users.map(user => ({
          ...user,
          status: user.status || "Moderate", // default if missing
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };
    loadUsers();
  }, []);

  // Filter & Sort
  useEffect(() => {
    let filtered = [...users];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.nic.toLowerCase().includes(term) ||
          user.vehicleNumber.toLowerCase().includes(term) ||
          user.indexNo.toString().includes(term)
      );
    }

    if (customerTypeFilter !== "ALL") {
      filtered = filtered.filter(
        (user) => user.customerType === customerTypeFilter
      );
    }

    filtered.sort((a, b) =>
      sortOrder === "ASC" ? a.indexNo - b.indexNo : b.indexNo - a.indexNo
    );

    setFilteredUsers(filtered);
  }, [searchTerm, customerTypeFilter, sortOrder, users]);

  const getIndexColor = (status) => {
    const clean = status?.trim().toLowerCase();
    switch (clean) {
      case "high risk":
        return "text-red-600 font-bold";
      case "moderate":
        return "text-yellow-600 font-bold";
      case "reliable":
        return "text-green-600 font-bold";
      default:
        return "";
    }
  };

  const handlePrintReceipt = (user) => {
    const receiptWindow = window.open("", "PRINT", "width=300,height=600");
    const generatedDateTime = new Date().toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
    });

    receiptWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial; width: 58mm; padding: 10px; font-size: 12px; }
            h2, p { text-align: center; margin: 0; padding: 2px 0; }
            .footer { margin-top: 10px; text-align: center; border-top: 1px dashed #000; padding-top: 5px; font-size: 11px; }
          </style>
        </head>
        <body>
          <h2><strong>Senevirathne Investments</strong></h2>
          <hr />
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Vehicle No:</strong> ${user.vehicleNumber}</p>
          <p><strong>Loan Received:</strong> Rs. ${user.total}</p>
          <p><strong>Received Date:</strong> ${new Date(user.date).toLocaleDateString()}</p>
          <div class="footer">
            <p>Received By: ....................................</p>
            <p>Paid By: ..........................................</p>
            <p>Thank you!<br/>Call: 077-7860211</p>
            <p style="font-size:10px;">Generated: ${generatedDateTime}</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
    receiptWindow.close();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-blue-50 to-blue-200 font-sans">
      
{/* HEADER SECTION */}
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="relative mb-2">

    {/* Main Container */}
    <div className="relative bg-white/70 rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden">
      {/* Decorative top border */}
      <div className="h-2 bg-linear-to-r from-blue-400 via-blue-500 to-blue-600"></div>
      
      <div className="p-8">
        {/* Title Section */}
        
        <div className="p-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-5 mb-3">
              <FaUsersCog className="text-3xl sm:text-5xl text-blue-700" />
              <h1 className="text-3xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Manage Customer Details
              </h1>
            </div>

            <p className="text-blue-400/80 max-w-2xl mx-auto">
              Manage customers, analyze risk levels, and print receipts with ease
            </p>
          </div>
        </div>

        {/* Search + Filters + Add Button */}
        <div className="flex flex-col py-0 md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-2/3">
            <IoSearch className="absolute left-4 top-3 text-blue-500 text-xl pointer-events-none" />
            <input
              type="text"
              placeholder="Search by index no, name, NIC, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-blue-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Filters + Add Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Customer Type Filter */}
            <div className="relative w-full sm:w-auto">
              <FiFilter className="absolute left-4 top-3 text-blue-500 text-xl pointer-events-none" />
              <select
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="w-full sm:w-auto pl-12 pr-4 py-3 bg-white/80 border-2 border-blue-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Customer Types</option>
                <option value="INSTALLMENT">Installment Payer</option>
                <option value="INTEREST_ONLY">Interest Payer</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="relative w-full sm:w-auto">
              <BiSort className="absolute left-4 top-3 text-blue-500 text-xl pointer-events-none" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full sm:w-auto pl-12 pr-4 py-3 bg-white/80 border-2 border-blue-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none appearance-none cursor-pointer"
              >
                <option value="ASC">Index No ↑ (Ascending)</option>
                <option value="DESC">Index No ↓ (Descending)</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => navigate("/addUser")}
              className="flex items-center justify-center bg-linear-to-r from-blue-800 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white w-12 h-12 rounded-full shadow-md transition-transform hover:scale-105"
            >
              <IoMdAddCircle className="text-3xl" />
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 text-center">
          <p className="text-blue-600 font-semibold">
            Showing {filteredUsers.length} of {users.length} customers
          </p>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* USERS TABLE */}
      <div className="max-w-6xl mx-4 sm:mx-auto bg-white rounded-lg shadow-lg border border-blue-200 p-4 sm:p-6 mb-10 overflow-x-auto">
        <table className="min-w-full text-sm border border-blue-200 rounded-md">
          <thead className="bg-blue-50 text-blue-800 font-semibold">
            <tr>
              <th className="py-3 px-3 text-left">Index No</th>
              <th className="py-3 px-3 text-left">NIC</th>
              <th className="py-3 px-3 text-left">Name</th>
              <th className="py-3 px-3 text-left">Vehicle No</th>
              <th className="py-3 px-3 text-left">Customer Type</th>
              <th className="py-3 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-blue-100 hover:bg-blue-50/60 transition"
                >
                  {/* Highlight index number based on status */}
                  <td className={`py-2 px-3 ${getIndexColor(user.status)}`}>
                    {user.indexNo}
                  </td>
                  <td className="py-2 px-3">{user.nic}</td>
                  <td className="py-2 px-3 font-medium text-gray-900">{user.name}</td>
                  <td className="py-2 px-3">{user.vehicleNumber}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.customerType === "INSTALLMENT"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.customerType}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      onClick={() => navigate(`/user/${user._id}`)}
                      className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-md shadow transition"
                    >
                      <FiEye /> Details
                    </button>
                    <button
                      onClick={() => navigate(`/activity/${user._id}`)}
                      className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md shadow transition"
                    >
                      <FiActivity /> Activity
                    </button>
                    <button
                      onClick={() => handlePrintReceipt(user)}
                      className="flex items-center justify-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow transition"
                    >
                      <FiPrinter /> Print
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No users found. Try adjusting filters or add a new user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
