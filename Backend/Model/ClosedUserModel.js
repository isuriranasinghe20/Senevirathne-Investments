const mongoose = require('mongoose');

const ClosedUserSchema = new mongoose.Schema({
  indexNo: String,
  nic: String,
  name: String,
  phone: String,
  date: Date,
  vehicleNumber: String,
  model: String,
  licenseDate: Date,
  total: Number,
  installment: Number,
  period: String,
  customerType: String,
  status: String,
  isClosed: { type: Boolean, default: true },

  // Add document fields
  customerNicDocs: [String],
  guarantorNicDocs: [String],
  vehicleBookDocs: [String],
  vehicleLicenseDocs: [String],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClosedUser", ClosedUserSchema);
