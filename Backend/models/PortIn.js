// 📄 models/PortIn.js
// Schema for storing Port-In request records

const mongoose = require('mongoose');

const portInSchema = new mongoose.Schema({
  number: { type: String, required: true },       // 📱 Mobile number being ported in
  operator: { type: String, required: true },     // 🏢 Operator name
  circle: { type: String, required: true },       // 🌐 Telecom circle
  date: { type: Date, required: true }            // 📅 Date of port-in
}, { timestamps: true });

module.exports = mongoose.model('PortIn', portInSchema);
