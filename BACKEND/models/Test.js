const mongoose = require('mongoose');

const testQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correctOptionIndex: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: Number, required: true, index: true },
    questions: { type: [testQuestionSchema], required: true },
    createdBy: { type: Number, required: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);
