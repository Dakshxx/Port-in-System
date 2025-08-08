// 📄 routes/exportRoutes.js
// Routes for exporting raw data of Port-In, Port-Out, and Snapback

const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// ✅ GET /export/port-in - Export all Port-In records
router.get('/port-in', exportController.exportPortIn);

// ✅ GET /export/port-out - Export all Port-Out records
router.get('/port-out', exportController.exportPortOut);

// ✅ GET /export/snapback - Export all Snapback records
router.get('/snapback', exportController.exportSnapback);

module.exports = router;
