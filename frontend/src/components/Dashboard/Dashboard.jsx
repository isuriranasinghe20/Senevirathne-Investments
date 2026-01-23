import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

function Dashboard() {
  const [totalLoan, setTotalLoan] = useState(0);
  const [closedTotalLoan, setClosedTotalLoan] = useState(0);
  const [closedTotalPaid, setClosedTotalPaid] = useState(0);
  const [profit, setProfit] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [financialEntries, setFinancialEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ date: '', amount: '' });
  const [activeCustomerCounts, setActiveCustomerCounts] = useState({
    totalCustomers: 0,
    installmentCustomers: 0,
    interestOnlyCustomers: 0,
  });

  const [closedCustomerCounts, setClosedCustomerCounts] = useState({
    totalCustomers: 0,
    installmentCustomers: 0,
    interestOnlyCustomers: 0,
  });

  useEffect(() => {
    api
      .get("/dashboard/customers/count")
      .then((res) => setActiveCustomerCounts(res.data));
  }, []);

  useEffect(() => {
    api
      .get("/dashboard/customers/closed/count")
      .then((res) => setClosedCustomerCounts(res.data));
  }, []);

  useEffect(() => {
    api
      .get("/dashboard/loan/total")
      .then((res) => setTotalLoan(res.data.totalLoan));
  }, []);

  useEffect(() => {
    api
      .get("/dashboard/closed/total")
      .then((res) => setClosedTotalLoan(res.data.totalAmount));
  }, []);

  useEffect(() => {
    api
      .get("/dashboard/closed/paid-amount")
      .then((res) => setClosedTotalPaid(res.data.totalPaid));
  }, []);

  useEffect(() => {
    setProfit(closedTotalPaid - closedTotalLoan);
  }, [closedTotalPaid, closedTotalLoan]);

  useEffect(() => {
    setTotalInvestment(totalLoan + closedTotalLoan);
  }, [totalLoan, closedTotalLoan]);

  const fetchFinancialEntries = () => {
    api
      .get("/financial-entries")
      .then((res) => setFinancialEntries(res.data.entries))
      .catch((err) => console.error("Error fetching financial entries:", err));
  };

  useEffect(() => {
    fetchFinancialEntries();
  }, []);

  const addFinancialEntry = () => {
    if (!newEntry.date || !newEntry.amount) {
      alert("Please enter both date and amount");
      return;
    }

    api
      .post("/financial-entries", {
        date: newEntry.date,
        amount: parseFloat(newEntry.amount)
      })
      .then(() => {
        setNewEntry({ date: '', amount: '' });
        fetchFinancialEntries();
        alert("Entry added successfully!");
      })
      .catch((err) => {
        console.error("Error adding entry:", err);
        alert("Error adding entry");
      });
  };

  const deleteFinancialEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      axios
        .delete(`/financial-entries/${id}`)
        .then(() => {
          fetchFinancialEntries();
          alert("Entry deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting entry:", err);
          alert("Error deleting entry");
        });
    }
  };

  // Prepare chart data
  const chartData = financialEntries
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: entry.amount,
      fullDate: entry.date
    }))
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  const Kpi = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );

  const StatCard = ({ title, value, icon, gradient, textColor }) => (
    <div className={`bg-linear-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/90 text-sm font-medium mb-2">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-100 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-linear-to-r from-[#0b1b53] to-[#1a2f7a] p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0b1b53]">Finance Dashboard</h1>
              <p className="text-gray-600 text-sm">Real-time financial overview and analytics</p>
            </div>
          </div>
        </div>

        {/* Total Investment Banner */}
        <div className="mb-8">
          <StatCard
            title="Total Investment"
            value={`Rs ${totalInvestment.toLocaleString()}`}
            gradient="from-[#0b1b53] to-[#1a2f7a]"
            textColor="text-white"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Active Customers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-linear-to-b from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Active Customers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              title="Total Active Customers"
              value={activeCustomerCounts.totalCustomers}
              gradient="from-green-500 to-emerald-600"
              textColor="text-white"
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard
              title="Active Installment Customers"
              value={activeCustomerCounts.installmentCustomers}
              gradient="from-blue-500 to-cyan-600"
              textColor="text-white"
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />
            <StatCard
              title="Active Interest Only Customers"
              value={activeCustomerCounts.interestOnlyCustomers}
              gradient="from-purple-500 to-pink-600"
              textColor="text-white"
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Active Customer Finance */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Active Customer Finance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Loan Amount (Active Customers)</p>
              <p className="text-3xl font-bold text-blue-600">Rs {totalLoan.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Closed Customers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-linear-to-b from-red-500 to-red-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Closed Customers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              title="Total Closed Customers"
              value={closedCustomerCounts.totalCustomers}
              gradient="from-red-500 to-rose-600"
              textColor="text-white"
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Closed Installment Customers"
              value={closedCustomerCounts.installmentCustomers}
              gradient="from-orange-500 to-red-600"
              textColor="text-white"
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <StatCard
              title="Closed Interest Only Customers"
              value={closedCustomerCounts.interestOnlyCustomers}
              gradient="from-pink-500 to-purple-600"
              textColor="text-white"
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Closed Customers Financial Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-linear-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Closed Customer Finance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Loan Amount (Closed Customers)</p>
              <p className="text-3xl font-bold text-amber-600">Rs {closedTotalLoan.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Paid by Closed Customers</p>
              <p className="text-3xl font-bold text-blue-600">Rs {closedTotalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <p className="text-gray-700 text-sm font-medium mb-2">Profit</p>
              <p className="text-3xl font-bold text-green-600">Rs {profit.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Financial Entries Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Financial Entries</h2>
          </div>

          {/* Add Entry Form */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-purple-100">
            <h3 className="text-lg font-bold text-[#0b1b53] mb-4">Enter Profit</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (Rs)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
              <button
                onClick={addFinancialEntry}
                className="w-full sm:w-auto px-6 py-2.5 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add Entry
              </button>
            </div>
          </div>

          {/* Profit Changes Chart */}
          {chartData.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-purple-100">
              <h3 className="text-lg font-bold text-[#0b1b53] mb-4">Profit Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `Rs ${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Amount']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Financial Entries Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-linear-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
              <h3 className="text-lg font-bold text-[#0b1b53]">Profit Changes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Amount (Rs)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialEntries.length > 0 ? (
                    financialEntries.map((entry) => (
                      <tr key={entry._id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-CA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          Rs {entry.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteFinancialEntry(entry._id)}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-all duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="font-medium">No financial entries found</p>
                          <p className="text-sm">Add your first entry above</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;