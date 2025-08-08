// 📄 models/Complaint.js
// Schema for complaint submissions

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  reason: { type: String, required: true },     // 📝 Reason for complaint
  status: { type: String, default: 'pending' }, // 🔄 Complaint status: pending/resolved/etc.
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // 👤 Linked user
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
