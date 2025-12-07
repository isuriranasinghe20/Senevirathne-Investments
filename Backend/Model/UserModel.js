const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    indexNo: { type: String },
    nic: { type: String },
    name: { type: String, required: true },
    phone: { type: String },
    date: { type: Date },
    vehicleNumber: { type: String },
    model: { type: String },
    licenseDate: { type: Date },
    total: { type: Number },
    installment: { type: Number },
    period: { type: Number },
    customerType: { type: String },
    status: { type: String, default: 'Moderate' },
    // store file info (paths or metadata) if you handle uploads later
    customerNicDocs: { type: [String], default: [] },
    guarantorNicDocs: { type: [String], default: [] },
    vehicleBookDocs: { type: [String], default: [] },
    vehicleLicenseDocs: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("UserModel", userSchema);