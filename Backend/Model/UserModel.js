const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id:{
        type: String,
        unique: true,
    },
    indexNo:{
        type: String,
        required: true,
        unique: true,
    },
    nic:{
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    vehicleNumber:{
        type: String,
        required: true,
        unique: true,
    },
    model:{
        type: String,
        required: true,
    },
    licenseDate:{
        type: Date,
        required: true,
    },
    total:{
        type: Number,
        required: true,
    },
    installment:{
        type: Number,
        required: true,
    },
    period:{
        type: Number,
        required: true,
    },
    customerType: {
    type: String,
    enum: ["INSTALLMENT", "INTEREST_ONLY"],
    required: true,
}

});

module.exports = mongoose.model("UserModel", userSchema);