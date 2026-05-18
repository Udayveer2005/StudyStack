const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'done', 'completed'],
      default: 'pending',
      index: true
    },
    // Kept as Number to stay compatible with existing frontend which stores numeric userId
    userId: { type: Number, required: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);

