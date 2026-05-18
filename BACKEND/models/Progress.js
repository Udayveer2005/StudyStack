const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    // Kept as Number to stay compatible with existing frontend payloads
    userId: { type: Number, required: true, index: true },
    courseId: { type: Number, required: true, index: true },
    completedLectureIds: { type: [Number], default: [] }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);

