const mongoose = require('mongoose');

const testSubmissionSchema = new mongoose.Schema(
  {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, index: true },
    userId: { type: Number, required: true, index: true },
    courseId: { type: Number, required: true, index: true },
    answers: { type: [Number], default: [] },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    autoPercent: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },
    teacherGrade: { type: String, default: '' },
    teacherFeedback: { type: String, default: '' },
    gradedBy: { type: Number, default: null },
    gradedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

testSubmissionSchema.index({ testId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TestSubmission', testSubmissionSchema);
