// 📄 controllers/snapbackController.js
// Handles fetching Snapback records

const Snapback = require('../models/Snapback');

// ✅ GET /snapback
// Description: Fetches all Snapback records from the DB
exports.getSnapback = async (req, res, next) => {
  try {
    const snapbackData = await Snapback.find();
    res.status(200).json(snapbackData);
  } catch (err) {
    next(err);
  }
};
