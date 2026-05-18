const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    // Kept as Number to stay compatible with existing frontend payloads
    userId: { type: Number, required: true, index: true },
    courseId: { type: Number, required: true, index: true },
    enrolledAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

