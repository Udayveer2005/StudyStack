const Test = require('../models/Test');
const TestSubmission = require('../models/TestSubmission');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Course = require('../models/Course');

async function getTests(req, res, next) {
  try {
    const courseId = req.query.courseId ? Number(req.query.courseId) : null;
    const filter = courseId ? { courseId } : {};
    const list = await Test.find(filter).sort({ createdAt: -1 }).lean().exec();
    return res.json(list);
  } catch (err) {
    return next(err);
  }
}

async function createTest(req, res, next) {
  try {
    const { title, courseId, questions } = req.body || {};
    if (!title || !courseId || !Array.isArray(questions) || questions.length === 0) {
      const error = new Error('title, courseId and questions[] are required');
      error.statusCode = 400;
      return next(error);
    }

    const normalizedQuestions = questions.map((q) => ({
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options.map((opt) => String(opt || '').trim()) : [],
      correctOptionIndex: Number(q.correctOptionIndex)
    }));

    const invalid = normalizedQuestions.some(
      (q) =>
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        q.options.some((opt) => !opt) ||
        Number.isNaN(q.correctOptionIndex) ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length
    );
    if (invalid) {
      const error = new Error('Each question must have text, 2+ options and valid correctOptionIndex');
      error.statusCode = 400;
      return next(error);
    }

    const created = await Test.create({
      title: String(title).trim(),
      courseId: Number(courseId),
      questions: normalizedQuestions,
      createdBy: Number(req.user.id)
    });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

async function submitTest(req, res, next) {
  try {
    const { testId } = req.params;
    const { answers } = req.body || {};
    const userId = Number(req.user.id);
    if (!Array.isArray(answers)) {
      const error = new Error('answers[] is required');
      error.statusCode = 400;
      return next(error);
    }

    const test = await Test.findById(testId).lean().exec();
    if (!test) {
      const error = new Error('Test not found');
      error.statusCode = 404;
      return next(error);
    }

    const enrolled = await Enrollment.findOne({ userId, courseId: Number(test.courseId) }).lean().exec();
    if (!enrolled) {
      const error = new Error('You must enroll in this course before attempting its test');
      error.statusCode = 403;
      return next(error);
    }

    const totalQuestions = test.questions.length;
    let score = 0;
    test.questions.forEach((question, index) => {
      if (Number(answers[index]) === Number(question.correctOptionIndex)) {
        score += 1;
      }
    });
    const autoPercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const course = await Course.findOne({ legacyId: Number(test.courseId) }).lean().exec();
    const totalLectures = Array.isArray(course?.lectures) ? course.lectures.length : 0;
    const progress = await Progress.findOne({ userId, courseId: Number(test.courseId) }).lean().exec();
    const completed = Array.isArray(progress?.completedLectureIds) ? progress.completedLectureIds.length : 0;
    const progressPercent = totalLectures > 0 ? Math.round((completed / totalLectures) * 100) : 0;

    const saved = await TestSubmission.findOneAndUpdate(
      { testId: test._id, userId },
      {
        $set: {
          courseId: Number(test.courseId),
          answers: answers.map((a) => Number(a)),
          score,
          totalQuestions,
          autoPercent,
          progressPercent,
          teacherGrade: '',
          teacherFeedback: '',
          gradedBy: null,
          gradedAt: null
        }
      },
      { upsert: true, new: true, runValidators: true }
    ).exec();

    return res.status(201).json(saved);
  } catch (err) {
    return next(err);
  }
}

async function getMySubmissions(req, res, next) {
  try {
    const userId = Number(req.user.id);
    const list = await TestSubmission.find({ userId }).sort({ updatedAt: -1 }).lean().exec();
    return res.json(list);
  } catch (err) {
    return next(err);
  }
}

async function getAllSubmissions(req, res, next) {
  try {
    const courseId = req.query.courseId ? Number(req.query.courseId) : null;
    const filter = courseId ? { courseId } : {};
    const list = await TestSubmission.find(filter)
      .sort({ updatedAt: -1 })
      .populate('testId', 'title courseId')
      .lean()
      .exec();
    return res.json(list);
  } catch (err) {
    return next(err);
  }
}

async function gradeSubmission(req, res, next) {
  try {
    const { submissionId } = req.params;
    const { teacherGrade, teacherFeedback } = req.body || {};
    if (!teacherGrade) {
      const error = new Error('teacherGrade is required');
      error.statusCode = 400;
      return next(error);
    }

    const updated = await TestSubmission.findByIdAndUpdate(
      submissionId,
      {
        $set: {
          teacherGrade: String(teacherGrade).trim(),
          teacherFeedback: String(teacherFeedback || '').trim(),
          gradedBy: Number(req.user.id),
          gradedAt: new Date()
        }
      },
      { new: true }
    ).exec();

    if (!updated) {
      const error = new Error('Submission not found');
      error.statusCode = 404;
      return next(error);
    }
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getTests,
  createTest,
  submitTest,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission
};
