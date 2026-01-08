import React, { useState } from "react";
import {
  X,
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
} from "lucide-react";

function calculateLoan({ amount, period, rate, type }) {
  const monthlyRate = rate / 100 / 12;

  if (type === "INSTALLMENT") {
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, period)) /
      (Math.pow(1 + monthlyRate, period) - 1);

    let balance = amount;
    let totalInterest = 0;

    for (let i = 1; i <= period; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;
      totalInterest += interest;
    }

    return {
      installment: emi,
      interestPerMonth: totalInterest / period,
      paymentPerMonth: emi,
      totalInterest,
      totalPayment: amount + totalInterest,
    };
  }

  if (type === "INTEREST_ONLY") {
    const interestPerMonth = amount * monthlyRate;
    const totalInterest = interestPerMonth * period;
    const totalPayment = amount + totalInterest;

    return {
      interestPerMonth,
      totalInterest,
      totalPayment,
    };
  }
}

export default function LoanCalculator({ onClose }) {
  const [form, setForm] = useState({
    amount: "",
    period: "",
    rate: "",
    type: "INSTALLMENT",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const res = calculateLoan({
      amount: Number(form.amount),
      period: Number(form.period),
      rate: Number(form.rate),
      type: form.type,
    });
    setResult(res);
  };

  return (
    <div className="fixed inset-0 bg-linear-to-br from-[#0b1b53]/20 via-[#0b1b53]/10 to-[#0b1b53]/20 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden mx-auto sm:w-[85%] md:w-[60%] transition-all duration-300 text-sm">
        {/* Header */}
        <div className="bg-linear-to-r from-[#0b1b53] to-[#142b6f] p-3 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-lg backdrop-blur-sm">
              <Calculator className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Loan Calculator
              </h2>
              <p className="text-blue-100 text-xs">Quick payment estimate</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-5">
          <div className="space-y-3">
            {/* Loan Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Loan Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <DollarSign className="text-gray-400" size={16} />
                </div>
                <input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  className="w-full border border-gray-300 pl-8 pr-3 py-2 rounded-md focus:ring-1 focus:ring-[#0b1b53] focus:border-transparent text-sm"
                  onChange={handleChange}
                  value={form.amount}
                />
              </div>
            </div>

            {/* Period */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Period (Months)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Calendar className="text-gray-400" size={16} />
                </div>
                <input
                  name="period"
                  type="number"
                  placeholder="Months"
                  className="w-full border border-gray-300 pl-8 pr-3 py-2 rounded-md focus:ring-1 focus:ring-[#0b1b53] focus:border-transparent text-sm"
                  onChange={handleChange}
                  value={form.period}
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Percent className="text-gray-400" size={16} />
                </div>
                <input
                  name="rate"
                  type="number"
                  step="0.1"
                  placeholder="Rate"
                  className="w-full border border-gray-300 pl-8 pr-3 py-2 rounded-md focus:ring-1 focus:ring-[#0b1b53] focus:border-transparent text-sm"
                  onChange={handleChange}
                  value={form.rate}
                />
              </div>
            </div>

            {/* Loan Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Loan Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <TrendingUp className="text-gray-400" size={16} />
                </div>
                <select
                  name="type"
                  className="w-full border border-gray-300 pl-8 pr-3 py-2 rounded-md focus:ring-1 focus:ring-[#0b1b53] focus:border-transparent text-sm appearance-none bg-white"
                  onChange={handleChange}
                  value={form.type}
                >
                  <option value="INSTALLMENT">Installment</option>
                  <option value="INTEREST_ONLY">Interest Only</option>
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculate}
              className="w-full bg-linear-to-r from-[#0b1b53] to-[#142b6f] text-white py-2.5 rounded-md hover:from-[#091540] hover:to-[#0b1b53] transition-all duration-200 font-medium shadow-md shadow-[#0b1b53]/30 mt-2 text-sm"
            >
              Calculate
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-4 bg-linear-to-br from-[#f8f9ff] to-[#eef0ff] rounded-lg p-4 border border-[#0b1b53]/10 text-sm">
              <h3 className="font-semibold text-[#0b1b53] mb-3 flex items-center gap-1">
                <Calculator size={10} />
                Results
              </h3>

              <div className="space-y-2 text-[#0b1b53]">
                <div className="flex justify-between border-b border-[#0b1b53]/20 pb-1">
                  <span>Interest / Month</span>
                  <span className="font-semibold">
                    Rs {result.interestPerMonth.toFixed(2)}
                  </span>
                </div>

                {result.paymentPerMonth && (
                  <div className="flex justify-between border-b border-[#0b1b53]/20 pb-1">
                    <span>Payment / Month</span>
                    <span className="font-semibold">
                      Rs {result.paymentPerMonth.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-b border-[#0b1b53]/20 pb-1">
                  <span>Total Interest</span>
                  <span className="font-semibold">
                    Rs {result.totalInterest.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 bg-[#0b1b53] -mx-4 px-4 -mb-4 rounded-b-lg text-white text-sm">
                  <span>Total Payment</span>
                  <span className="font-bold">
                    Rs {result.totalPayment.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
