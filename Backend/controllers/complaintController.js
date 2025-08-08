// 📄 controllers/complaintController.js
// Handles creation, retrieval, and status update of complaints

const Complaint = require('../models/Complaint');

// ✅ POST /complaints
// Description: Submits a new complaint
exports.submitComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user.id // 👤 Auth middleware must set req.user
    });
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

// ✅ GET /complaints
// Description: Fetches complaints belonging to the authenticated user
exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    res.status(200).json(complaints);
  } catch (err) {
    next(err);
  }
};

// ✅ PUT /complaints/:id
// Description: Updates the status of a complaint (e.g., to resolved)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(complaint);
  } catch (err) {
    next(err);
  }
};
