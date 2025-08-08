const Complaint = require('../models/Complaint');
const PortIn = require('../models/PortIn');
const PortOut = require('../models/PortOut');
const Snapback = require('../models/Snapback');
const Subscriber = require('../models/subscriberModel');

// GET /dashboard/stats
// Description: Returns comprehensive dashboard statistics
exports.getStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalSubscribers = await Subscriber.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    const portInToday = await PortIn.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    const portOutToday = await PortOut.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    const failedPorts = totalComplaints - resolvedComplaints - pendingComplaints;

    res.status(200).json({
      totalPorts: totalSubscribers,
      portInToday,
      portOutToday,
      pendingPorts: pendingComplaints,
      successfulPorts: resolvedComplaints,
      failedPorts: failedPorts > 0 ? failedPorts : 0,
    });
  } catch (err) {
    next(err);
  }
};

// GET /dashboard/reasons/analysis
// Description: Returns grouped complaint reasons for analytics
exports.reasonAnalysis = async (req, res, next) => {
  try {
    const analysis = await Complaint.aggregate([
      { $group: { _id: '$reason', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json(analysis);
  } catch (err) {
    next(err);
  }
};