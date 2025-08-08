const express = require('express');
const router = express.Router();
// Import both functions from the controller
const { getPortIn, createPortIn } = require('../controllers/portController');

// This route fetches the data for the table
router.get('/', getPortIn);

// This new route handles the form submission
router.post('/', createPortIn);

module.exports = router;