import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { FaAddressCard } from "react-icons/fa";

function ClosedUserDetails() {
  const { id } = useParams(); // get user id from route
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toISOString().split("T")[0];
};


  useEffect(() => {
    api
      .get(`/closed-users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));
  }, [id]);

  if (!user)
    return (
      <h2 className="text-center mt-10 text-blue-600 font-semibold">
        Loading...
      </h2>
    );

  return (
    <div className="min-h-screen py-4 bg-linear-to-br from-blue-100 to-blue-200 font-sans">

      {/* Header */}
      <div className="relative max-w-5xl mx-4 sm:mx-auto my-6 p-6 bg-white/70 backdrop-blur-md rounded-2xl border-blue-100 shadow-lg text-center">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-300 via-blue-100 to-blue-300 animate-gradient-border blur-sm -z-10"></div>
        <div className="flex items-center justify-center gap-4">
          <FaAddressCard className="text-3xl text-blue-700" />
          <h1 className="text-xl font-bold text-blue-700">Closed User Details</h1>
        </div>
        <p className="text-sm text-blue-700 opacity-70 mt-1">
          View full details and uploaded documents for this customer.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-4 sm:mx-auto bg-white rounded-lg shadow-lg border border-blue-100 p-6 sm:p-8 mb-10">
        
        {/* Customer Info */}
        <section>
          <h2 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
            Personal & Vehicle Information
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-gray-700">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Index No:</strong> {user.indexNo}
            </p>
            <p>
              <strong>NIC:</strong> {user.nic}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Registration Date:</strong> {formatDate(user.date)}
            </p>
            <p>
              <strong>Vehicle No:</strong> {user.vehicleNumber}
            </p>
            <p>
              <strong>Model:</strong> {user.model}
            </p>
            <p>
              <strong>License Date:</strong> {formatDate(user.licenseDate)}
            </p>
            <p>
              <strong>Total Loan:</strong> Rs {user.total}
            </p>
            <p>
              <strong>Installment:</strong> Rs {user.installment}
            </p>
            <p>
              <strong>Period:</strong> {user.period}
            </p>
            <p>
              <strong>Customer Type:</strong> {user.customerType}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>
            <p>
              <strong>Closed:</strong> {user.isClosed ? "Yes" : "No"}
            </p>
          </div>
        </section>

        {/* Uploaded Files */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
            Uploaded Documents
          </h2>
          <div className="space-y-4 text-blue-700">
            <div>
              <h3 className="font-medium">Customer NIC Documents:</h3>
              {user.customerNicDocs?.length > 0 ? (
                user.customerNicDocs.map((file, i) => (
                  <p key={i}>
                    <a
                      href={`${api.defaults.baseURL}/${file}`}
                      target="_blank"
                      className="hover:underline"
                      rel="noopener noreferrer"
                    >
                      {file.split("/").pop()}
                    </a>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No files uploaded.</p>
              )}
            </div>

            <div>
              <h3 className="font-medium">Guarantor NIC Documents:</h3>
              {user.guarantorNicDocs?.length > 0 ? (
                user.guarantorNicDocs.map((file, i) => (
                  <p key={i}>
                    <a
                      href={`${api.defaults.baseURL}/${file}`}
                      target="_blank"
                      className="hover:underline"
                      rel="noopener noreferrer"
                    >
                      {file.split("/").pop()}
                    </a>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No files uploaded.</p>
              )}
            </div>

            <div>
              <h3 className="font-medium">Vehicle Book Documents:</h3>
              {user.vehicleBookDocs?.length > 0 ? (
                user.vehicleBookDocs.map((file, i) => (
                  <p key={i}>
                    <a
                      href={`${api.defaults.baseURL}/${file}`}
                      target="_blank"
                      className="hover:underline"
                      rel="noopener noreferrer"
                    >
                      {file.split("/").pop()}
                    </a>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No files uploaded.</p>
              )}
            </div>

            <div>
              <h3 className="font-medium">Vehicle License Documents:</h3>
              {user.vehicleLicenseDocs?.length > 0 ? (
                user.vehicleLicenseDocs.map((file, i) => (
                  <p key={i}>
                    <a
                      href={`${api.defaults.baseURL}/${file}`}
                      target="_blank"
                      className="hover:underline"
                      rel="noopener noreferrer"
                    >
                      {file.split("/").pop()}
                    </a>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No files uploaded.</p>
              )}
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/addUser", { state: { user } })}
            className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md shadow transition"
          >
            Return Details
          </button>
        </div>


      </div>
     
    </div>
  );
}

export default ClosedUserDetails;
