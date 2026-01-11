const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  totalAmount: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
