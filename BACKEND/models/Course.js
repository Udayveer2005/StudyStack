const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    duration: { type: String, default: '' }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0, index: true },
    level: { type: String, default: '' },
    isFree: { type: Boolean, default: false },
    lectures: { type: [lectureSchema], default: undefined }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

