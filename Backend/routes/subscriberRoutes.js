const express = require('express');
const router = express.Router();
const { getSubscribers, createSubscriber } = require('../controllers/subscriberController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Route to get all subscribers
router.post('/', getSubscribers);

// Route to create a new subscriber
router.post('/create', createSubscriber);

module.exports = router;