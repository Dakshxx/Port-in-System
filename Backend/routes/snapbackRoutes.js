const express = require('express');
const router = express.Router();
const snapbackController = require('../controllers/snapbackController');

// CORRECTED: The path is now '/' instead of '/snapback'
router.get('/', snapbackController.getSnapback);

module.exports = router;