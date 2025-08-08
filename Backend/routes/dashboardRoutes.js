// 📄 routes/dashboardRoutes.js
// Routes for dashboard analytics like stats and reason-based complaint breakdown

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// ✅ GET /dashboard/stats - Returns complaint statistics (e.g. resolved, pending)
router.get('/stats', dashboardController.getStats);

// ✅ GET /dashboard/reasons/analysis - Returns grouped complaint reasons
router.get('/reasons/analysis', dashboardController.reasonAnalysis);

module.exports = router;
