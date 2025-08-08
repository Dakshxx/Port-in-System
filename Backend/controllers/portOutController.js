// 📄 controllers/portOutController.js
// Handles fetching port-out records

const PortOut = require('../models/PortOut');

// ✅ GET /port-out
// Description: Fetches all Port-Out records from the DB
exports.getPortOut = async (req, res, next) => {
  try {
    const portOutData = await PortOut.find(); // Add filtering if needed
    res.status(200).json(portOutData);
  } catch (err) {
    next(err);
  }
};
