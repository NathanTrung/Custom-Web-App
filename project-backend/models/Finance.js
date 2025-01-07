const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true }, // Income or Expense
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;
