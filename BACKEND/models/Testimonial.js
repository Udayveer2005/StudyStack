const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    course: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);

