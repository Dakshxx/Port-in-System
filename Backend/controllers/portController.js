const PortIn = require('../models/PortIn');

// GET /port-in
// Description: Fetches all Port-In records from the DB
exports.getPortIn = async (req, res, next) => {
  try {
    const portInData = await PortIn.find();
    res.status(200).json(portInData);
  } catch (err) {
    next(err);
  }
};

// POST /port-in - NEW FUNCTION
// Description: Creates and saves a new Port-In record
exports.createPortIn = async (req, res, next) => {
  try {
    const newPortIn = await PortIn.create(req.body);
    res.status(201).json(newPortIn);
  } catch (err) {
    next(err);
  }
};