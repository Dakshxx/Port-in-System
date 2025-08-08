// 📄 middlewares/authMiddleware.js
// Middleware to authenticate users using Bearer token

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // 🔐 Extract token from Bearer header
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔍 Verify token
    const user = await User.findById(decoded.id); // 🔎 Fetch user from DB

    if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid user' });

    req.user = user; // 🧾 Attach user to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Token failed' });
  }
};
