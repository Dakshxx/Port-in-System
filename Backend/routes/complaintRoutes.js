// 📄 routes/complaintRoutes.js
// Routes for handling complaints (submit, view, update status)

const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ POST /complaints - Submit a new complaint (auth required)
router.post('/', authMiddleware, complaintController.submitComplaint);

// ✅ GET /complaints - Fetch user’s complaints (auth required)
router.get('/', authMiddleware, complaintController.getComplaints);

// ✅ PUT /complaints/:id - Update complaint status (auth required)
router.put('/:id', authMiddleware, complaintController.updateComplaintStatus);

module.exports = router;
