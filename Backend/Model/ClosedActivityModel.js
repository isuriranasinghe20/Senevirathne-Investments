const mongoose = require("mongoose");

const ClosedActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClosedUser",
    required: true,
  },
  no: Number,
  date: String,
  paidAmount: Number,
  paid: Boolean,
 
});

module.exports = mongoose.model("ClosedActivity", ClosedActivitySchema);
