const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  no: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  paidAmount: {           
    type: Number,
    default: 0
  },
  paid: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Activity", ActivitySchema);
