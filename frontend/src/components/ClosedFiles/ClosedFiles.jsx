import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { BiSolidUserDetail } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";



function ClosedFiles() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("ASC");

  // Fetch closed users
  useEffect(() => {
    api
      .get("/closed-users")
      .then((res) => {
        const data = res.data.users || res.data || [];
        setUsers(Array.isArray(data) ? data : []);
        setFilteredUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  }, []);

  // Search + Filter + Sort
  useEffect(() => {
    let filtered = [...users];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.nic?.toLowerCase().includes(term) ||
          user.vehicleNumber?.toLowerCase().includes(term) ||
          user.indexNo?.toString().includes(term)
      );
    }

    if (customerTypeFilter !== "ALL") {
      filtered = filtered.filter(
        (user) => user.customerType === customerTypeFilter
      );
    }

    filtered.sort((a, b) =>
      sortOrder === "ASC"
        ? a.indexNo - b.indexNo
        : b.indexNo - a.indexNo
    );

    setFilteredUsers(filtered);
  }, [searchTerm, customerTypeFilter, sortOrder, users]);

  return (
    <div className="min-h-screen py-4 bg-linear-to-br from-blue-100 to-blue-200 font-sans">

      {/* HEADER */}
      <div className="relative max-w-6xl mx-4 sm:mx-auto my-6 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-blue-300 shadow-lg text-center">
        <div className="flex items-center justify-center gap-3">
          <BiSolidUserDetail className="text-3xl text-blue-600" />
          <h1 className="text-xl font-bold text-blue-700">
            Closed Customers
          </h1>
        </div>
        <p className="text-sm text-blue-700 opacity-70 mt-1">
          View closed users and access their details or activity records
        </p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="max-w-6xl mx-4 sm:mx-auto mb-6">
        <div className="bg-white/80 rounded-2xl p-6 shadow border border-blue-200">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="relative w-full md:w-2/3">
              <IoSearch className="absolute left-4 top-3 text-blue-500 text-xl" />
              <input
                type="text"
                placeholder="Search by index no, name, NIC, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Customer Type */}
            <div className="relative w-full sm:w-auto">
              <FiFilter className="absolute left-4 top-3 text-blue-500 text-xl" />
              <select
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl outline-none cursor-pointer"
              >
                <option value="ALL">All Customer Types</option>
                <option value="INSTALLMENT">Installment Payer</option>
                <option value="INTEREST_ONLY">Interest Payer</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative w-full sm:w-auto">
              <BiSort className="absolute left-4 top-3 text-blue-500 text-xl" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl outline-none cursor-pointer"
              >
                <option value="ASC">Index No ↑</option>
                <option value="DESC">Index No ↓</option>
              </select>
            </div>
          </div>

          <p className="mt-4 text-center text-blue-600 font-semibold">
            Showing {filteredUsers.length} of {users.length} closed customers
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-4 sm:mx-auto bg-white rounded-lg shadow-lg border border-blue-200 p-4 sm:p-6 mb-10 overflow-x-auto">
        <table className="min-w-full text-sm border border-blue-200 rounded-md">
          <thead className="bg-blue-50 text-blue-800 font-semibold">
            <tr>
              <th className="py-3 px-3 text-left">Index No</th>
              <th className="py-3 px-3 text-left">NIC</th>
              <th className="py-3 px-3 text-left">Name</th>
              <th className="py-3 px-3 text-left">Vehicle No</th>
              <th className="py-3 px-3 text-left">Customer Type</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-blue-100 hover:bg-blue-50/60 transition"
                >
                  {/* Highlight Index */}
                  <td className="py-2 px-3 font-bold text-blue-700">
                    {user.indexNo}
                  </td>

                  <td className="py-2 px-3">{user.nic}</td>

                  {/* Highlight Name */}
                  <td className="py-2 px-3 font-semibold text-gray-900">
                    {user.name}
                  </td>

                  <td className="py-2 px-3">{user.vehicleNumber}</td>

                  {/* Highlight Customer Type */}
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
                      onClick={() => navigate(`/closed-user/${user._id}`)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-800 text-white rounded-md shadow"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/closed-users/${user._id}/activity`)
                      }
                      className="px-3 py-1 bg-green-600 hover:bg-green-800 text-white rounded-md shadow"
                    >
                      Activity
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                  No closed users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClosedFiles;
