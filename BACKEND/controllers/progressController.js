const Progress = require('../models/Progress');

/**
 * getUserCourseProgress - GET /progress
 * -------------------------------------
 * - GET /progress?userId=&courseId=  -> returns a single progress object for this user+course (or an empty default).
 * - GET /progress?userId=            -> returns an array of all progress records for this user.
 */
async function getUserCourseProgress(req, res, next) {
  try {
    const userId = Number(req.query.userId);
    const courseIdParam = req.query.courseId;

    if (!userId) {
      const error = new Error('userId query parameter is required');
      error.statusCode = 400;
      return next(error);
    }

    if (!courseIdParam) {
      // Only userId provided: return all progress records for this user.
      const list = await Progress.find({ userId }).sort({ updatedAt: -1 }).exec();
      return res.json(list);
    }

    const courseId = Number(courseIdParam);
    const existing = await Progress.findOne({ userId, courseId }).exec();

    if (!existing) {
      return res.json({
        userId,
        courseId,
        completedLectureIds: []
      });
    }

    return res.json(existing);
  } catch (err) {
    next(err);
  }
}

/**
 * upsertUserCourseProgress - POST /progress
 * Body: { userId, courseId, completedLectureIds }
 * Creates or updates progress for this user+course.
 */
async function upsertUserCourseProgress(req, res, next) {
  try {
    const { userId, courseId, completedLectureIds } = req.body || {};

    if (!userId || !courseId || !Array.isArray(completedLectureIds)) {
      const error = new Error('userId, courseId and completedLectureIds[] are required');
      error.statusCode = 400;
      return next(error);
    }

    const normalizedUserId = Number(userId);
    const normalizedCourseId = Number(courseId);

    const normalizedIds = [...new Set(completedLectureIds.map(Number))];

    const updated = await Progress.findOneAndUpdate(
      { userId: normalizedUserId, courseId: normalizedCourseId },
      { $set: { completedLectureIds: normalizedIds } }, // "NoSQL document update" ($set)
      { upsert: true, new: true, runValidators: true }
    ).exec();

    const wasCreated = updated.createdAt?.getTime?.() === updated.updatedAt?.getTime?.();
    return res.status(wasCreated ? 201 : 200).json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserCourseProgress,
  upsertUserCourseProgress
};

