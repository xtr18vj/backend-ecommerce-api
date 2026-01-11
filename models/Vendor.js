const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  companyName: String
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
