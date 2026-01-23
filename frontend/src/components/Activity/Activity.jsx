import React, { useEffect, useState } from "react"; 
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";

function Activity() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("Moderate");
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    no: "",
    date: "",
    paidAmount: "",
    paid: false,
  });

  const [isClosed, setIsClosed] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [alertVisible, setAlertVisible] = useState(false);

  const totalPaidAmount = activities.reduce(
    (sum, a) => sum + (Number(a.paidAmount) || 0),
    0
  );

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data.user);
        setStatus(res.data.user.status);
        setIsClosed(res.data.user.isClosed || false);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    api
      .get(`/activity/${id}`)
      .then((res) => setActivities(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    api
      .post("/activity", {
        userId: id,
        ...form,
        paidAmount: Number(form.paidAmount),
      })
      .then((res) => {
        setActivities([...activities, res.data]);
        setForm({ no: "", date: "", paidAmount: "", paid: false });
        showAlert("Activity added successfully!");
      })
      .catch(() => showAlert("Error saving activity", "error"));
  };

  const confirmCloseAccount = () => {
    setConfirmClose(false);
    setIsClosed(true);

    api
      .put(`/users/${id}`, {
        ...user,
        isClosed: true,
      })
      .then(() => showAlert("Account locked successfully"));
  };

  // ✅ Print function
  const handlePrintReceipt = (row) => {
    const receiptWindow = window.open("", "PRINT", "width=300,height=600");
    const customerTypeText =
      user.customerType === "INSTALLMENT" ? "Installment" : "Interest";
    const generatedDateTime = new Date().toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
    });

    receiptWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial; width: 58mm; padding: 10px; font-size: 12px; }
            h2, p { text-align: center; margin: 5px 0; }
            .footer { margin-top: 15px; text-align: center; border-top: 1px dashed #000; padding-top: 10px; font-size: 11px; }
          </style>
        </head>
        <body>
          <h2><strong>Senevirathne Investments</strong></h2>
          <hr />
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Vehicle:</strong> ${user.vehicleNumber}</p>
          <p><strong>Paid Amount:</strong> Rs.${row.paidAmount} (${customerTypeText})</p>
          <p><strong>Paid Date:</strong> ${row.date.substring(0, 10)}</p>
          <div class="footer">
            Thank you for your payment!<br/>Call: 077-7860211
            <p style="font-size:10px;">Generated: ${generatedDateTime}</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  if (!user)
    return <h2 className="text-center mt-10 text-blue-600">Loading...</h2>;

  return (
    <div className="relative min-h-screen py-4 bg-linear-to-br from-blue-100 to-blue-200 font-sans">

      {/* ALERT */}
      {alert.message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-md text-center z-50 ${
            alert.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } transition-opacity duration-300 ${
            alertVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className={`${isClosed ? "pointer-events-none opacity-50" : ""}`}>
        {/* HEADER */}
        <div className="relative max-w-5xl mx-4 sm:mx-auto my-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-blue-200 shadow-lg text-center">
          <div className="flex items-center justify-center gap-3">
            <FcViewDetails className="text-3xl" />
            <h1 className="text-xl font-bold text-blue-700">
              Customer Activity
            </h1>
          </div>
          <p className="text-sm text-blue-700 opacity-70 mt-1">
            Manage payment records and update customer status.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="max-w-5xl mx-4 sm:mx-auto bg-white rounded-lg shadow-lg border border-blue-200 p-6 sm:p-8 mb-10">

          {/* CUSTOMER INFO */}
<section>
  <h2 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
    Customer Information
  </h2>

  <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
    {/* Name */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Name</span>
      <span className="text-blue-700 font-medium">{user.name}</span>
    </div>

    {/* Vehicle Number */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Vehicle No</span>
      <span className="text-blue-700 font-medium">{user.vehicleNumber}</span>
    </div>

    {/* Total Loan */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Loan Amount</span>
      <span className="text-blue-700 font-medium">Rs {user.total}</span>
    </div>

    {/* Installment */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Installment</span>
      <span className="text-blue-700 font-medium">Rs {user.installment}</span>
    </div>

    {/* Period */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Period</span>
      <span className="text-blue-700 font-medium">{user.period}</span>
    </div>

    {/* Total Paid */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Total Paid</span>
      <span className="text-blue-700 font-medium">Rs {totalPaidAmount}</span>
    </div>

    {/* Customer Status */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col">
      <span className="text-gray-500 text-xs">Status</span>
      <select
        disabled={isClosed}
        className="border border-blue-300 bg-blue-50 rounded-md px-2 py-1 text-blue-700"
        value={status}
        onChange={(e) => {
          const newStatus = e.target.value;
          setStatus(newStatus);
          api.put(`/users/${id}`, {
            ...user,
            status: newStatus,
          });
        }}
      >
        <option>Reliable</option>
        <option>Moderate</option>
        <option>High Risk</option>
      </select>
    </div>

    {/* Closed Checkbox */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
      <input
        type="checkbox"
        checked={isClosed}
        disabled={isClosed}
        onChange={(e) => setConfirmClose(true)}
        className="h-4 w-4 accent-blue-500"
      />
      <span className="text-blue-700 font-medium">Mark as Closed</span>
    </div>
  </div>
</section>

          {/* Payment History */}
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
                    <th className="py-2 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a._id} className="border-t border-blue-100 hover:bg-blue-50/60">
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={a.no}
                          disabled={isClosed}
                          onChange={(e) =>
                            setActivities((prev) =>
                              prev.map((act) =>
                                act._id === a._id
                                  ? { ...act, no: e.target.value }
                                  : act
                              )
                            )
                          }
                          className="w-20 border border-blue-200 rounded px-2 py-1 bg-blue-50 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="date"
                          value={a.date ? a.date.substring(0, 10) : ""}
                          disabled={isClosed}
                          onChange={(e) =>
                            setActivities((prev) =>
                              prev.map((act) =>
                                act._id === a._id
                                  ? { ...act, date: e.target.value }
                                  : act
                              )
                            )
                          }
                          className="border border-blue-200 rounded px-2 py-1 bg-blue-50 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={a.paidAmount || ""}
                          disabled={isClosed}
                          onChange={(e) =>
                            setActivities((prev) =>
                              prev.map((act) =>
                                act._id === a._id
                                  ? { ...act, paidAmount: Number(e.target.value) }
                                  : act
                              )
                            )
                          }
                          className="w-28 border border-blue-200 rounded px-2 py-1 bg-blue-50 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={a.paid}
                          disabled={isClosed}
                          onChange={(e) =>
                            setActivities((prev) =>
                              prev.map((act) =>
                                act._id === a._id
                                  ? { ...act, paid: e.target.checked }
                                  : act
                              )
                            )
                          }
                          className="h-4 w-4 accent-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-center space-x-2">
                        <button
                          onClick={() =>
                            api.put(`/activity/${a._id}`, a)
                              .then(() => showAlert("Activity updated"))
                          }
                          disabled={isClosed}
                          className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() =>
                            api.delete(`/activity/${a._id}`)
                              .then(() => setActivities(prev => prev.filter(act => act._id !== a._id)))
                              .then(() => showAlert("Deleted"))
                          }
                          disabled={isClosed}
                          className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(a)}
                          className="bg-green-500 hover:bg-green-700 text-white px-4.5 py-1 rounded transition pointer-events-auto"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* New Entry */}
                  <tr className="bg-blue-50/50 border-t border-blue-100">
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        name="no"
                        value={form.no}
                        onChange={handleChange}
                        disabled={isClosed}
                        className="w-20 border border-blue-200 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        disabled={isClosed}
                        className="border border-blue-200 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        name="paidAmount"
                        value={form.paidAmount}
                        onChange={handleChange}
                        disabled={isClosed}
                        className="w-28 border border-blue-200 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        name="paid"
                        checked={form.paid}
                        onChange={handleChange}
                        disabled={isClosed}
                        className="h-4 w-4 accent-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={handleSave}
                        disabled={isClosed}
                        className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>

      {/* Lock Overlay */}
      {isClosed && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <p className="text-white text-lg font-semibold">
            Account Closed          
          </p>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmClose && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Confirm Account Closure
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently lock this account.
              <br />Are you sure?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCloseAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Yes, Lock
              </button>
              <button
                onClick={() => setConfirmClose(false)}
                className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Activity;
