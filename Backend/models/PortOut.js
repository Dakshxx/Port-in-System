// 📄 models/PortOut.js
// Schema for storing Port-Out request records

const mongoose = require('mongoose');

const portOutSchema = new mongoose.Schema({
  number: { type: String, required: true },        // 📱 Mobile number being ported out
  reason: { type: String, required: true },        // 📝 Reason for leaving
  date: { type: Date, required: true }             // 📅 Date of port-out
}, { timestamps: true });

module.exports = mongoose.model('PortOut', portOutSchema);
