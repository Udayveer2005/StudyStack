const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Numeric id kept for compatibility with existing frontend and legacy JSON data
    legacyId: { type: Number, unique: true, index: true },
    username: { type: String, required: true, trim: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['user'] }, // admin | moderator | user
    refreshTokenHashes: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

