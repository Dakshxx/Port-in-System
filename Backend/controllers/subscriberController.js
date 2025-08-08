const Subscriber = require('../models/subscriberModel');

// POST /subscribers
exports.getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (err) {
    next(err);
  }
};

// POST /subscribers/create
exports.createSubscriber = async (req, res, next) => {
  try {
    const newSubscriber = await Subscriber.create(req.body);
    res.status(201).json(newSubscriber);
  } catch (err) {
    next(err);
  }
};