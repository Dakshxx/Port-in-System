// 📄 middlewares/errorHandler.js
// Centralized error handling middleware

module.exports = (err, req, res, next) => {
  console.error(err.stack); // 📋 Log stack trace for debugging

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error' // ⚠️ Return error message
  });
};
