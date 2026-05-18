const mongoose = require('mongoose');

function requireDb(req, res, next) {
  // 1 = connected
  if (mongoose.connection.readyState === 1) return next();

  const err = new Error(
    'Database not connected. Check MONGO_URI / Atlas Network Access / DB user credentials.'
  );
  err.statusCode = 503;
  return next(err);
}

module.exports = { requireDb };

