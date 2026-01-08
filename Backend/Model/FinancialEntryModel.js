const mongoose = require('mongoose');

const FinancialEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'investment', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("FinancialEntry", FinancialEntrySchema);