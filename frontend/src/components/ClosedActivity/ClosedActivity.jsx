import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaFolderClosed } from "react-icons/fa6";

function ClosedActivity() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const totalPaidAmount = (activities ?? []).reduce(
  (sum, activity) => sum + (activity.paidAmount || 0),
  0
);



  useEffect(() => {
    axios
      .get(`http://localhost:5000/closed-users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:5000/closed-activity/${id}`)
      .then((res) => setActivities(res.data || []))
      .catch((err) => console.log(err));
  }, [id]);

    useEffect(() => {
      if (activities.length > 0) {
        axios
          .post(`http://localhost:5000/closed-activity/total/${id}`, {
            totalPaidAmount,
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
      }
    }, [activities, id, totalPaidAmount]);


  if (!user)
    return (
      <h2 className="text-center mt-10 text-blue-600 font-semibold">
        Loading...
      </h2>
    );

 


  return (
    <div className="min-h-screen py-4 bg-linear-to-br from-blue-100 to-blue-200 font-sans">


      {/* Header */}
      <div className="relative max-w-5xl mx-4 sm:mx-auto my-6 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-blue-200 shadow-lg text-center">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-300 via-blue-100 to-blue-300 animate-gradient-border blur-sm -z-10"></div>
        <div className="flex items-center justify-center gap-4">
          <FaFolderClosed className="text-3xl text-blue-600 size-6" />
          <h1 className="text-xl font-bold text-blue-700">
            Closed Customer Activity
          </h1>
        </div>
        <p className="text-sm text-blue-700 opacity-70 mt-1">
          View all payment records for closed customers.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-4 sm:mx-auto bg-white rounded-lg shadow-lg border border-blue-200  p-6 sm:p-8 mb-10">
        {/* Customer Info */}
        <section>
          <h2 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
            Customer Information
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-gray-700">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Vehicle No:</strong> {user.vehicleNumber}
            </p>
            <p>
              <strong>Loan:</strong> Rs {user.total}
            </p>
            <p>
              <strong>Installment:</strong> Rs {user.installment}
            </p>
            <p>
              <strong>Period:</strong> {user.period}
            </p>
          </div>
        </section>

        {/* Total Paid Amount */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-2">
            Total Paid Amount
          </h2>
          <p className="text-blue-700 font-bold text-xl">
            Rs {totalPaidAmount}
          </p>
        </section>


        {/* Activity Table */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
            Payment History
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-blue-200 rounded-md text-sm">
              <thead className="bg-blue-50 text-blue-800 font-medium">
                <tr>
                  <th className="py-2 px-3 text-left">No</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">Paid Amount (Rs)</th>
                  <th className="py-2 px-3 text-center">Paid</th>
                </tr>
              </thead>
              <tbody>
                {activities?.length > 0 ? (
                  activities.map((a) => (
                    <tr
                      key={a._id}
                      className="border-t border-blue-100 hover:bg-blue-50/60"
                    >
                      <td className="py-2 px-3">{a.no}</td>
                      <td className="py-2 px-3">
                        {new Date(a.date).toLocaleDateString("en-CA")}
                      </td>
                      <td className="py-2 px-3">{a.paidAmount}</td>
                      <td className="py-2 px-3 text-center">
                        {a.paid ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No activities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ClosedActivity;
