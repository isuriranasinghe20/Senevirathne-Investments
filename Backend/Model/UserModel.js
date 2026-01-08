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
    customerNicDocs: [String],
    guarantorNicDocs: [String],
    vehicleBookDocs: [String],
    vehicleLicenseDocs: [String]
}, { timestamps: true });


module.exports = mongoose.model("UserModel", userSchema);