// 📄 controllers/exportController.js
// Exports data for PortIn, PortOut, and Snapback in raw form (could be extended to CSV/Excel)

const PortIn = require('../models/PortIn');
const PortOut = require('../models/PortOut');
const Snapback = require('../models/Snapback');

// ✅ GET /export/port-in
// Description: Returns all Port-In data (as raw JSON)
exports.exportPortIn = async (req, res, next) => {
  try {
    const data = await PortIn.find();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

// ✅ GET /export/port-out
// Description: Returns all Port-Out data
exports.exportPortOut = async (req, res, next) => {
  try {
    const data = await PortOut.find();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

// ✅ GET /export/snapback
// Description: Returns all Snapback data
exports.exportSnapback = async (req, res, next) => {
  try {
    const data = await Snapback.find();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
