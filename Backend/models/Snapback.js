// 📄 models/Snapback.js
// Schema for snapback entries (when users return after porting)

const mongoose = require('mongoose');

const snapbackSchema = new mongoose.Schema({
  number: { type: String, required: true },        // 📱 Mobile number returning
  operator: { type: String, required: true },      // 🏢 Operator rejoined
  date: { type: Date, required: true }             // 📅 Date of snapback
}, { timestamps: true });

module.exports = mongoose.model('Snapback', snapbackSchema);
