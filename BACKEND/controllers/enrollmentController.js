const Enrollment = require('../models/Enrollment');

/**
 * enrollUser - POST /enroll
 * -------------------------
 * Creates a new enrollment. Body: { userId, courseId }.
 * Steps:
 * 1. Validate userId and courseId are present.
 * 2. Read current enrollments from file.
 * 3. Check if this user is already enrolled in this course (avoid duplicates).
 * 4. Generate new id, create enrollment object with enrolledAt timestamp.
 * 5. Push to array, write to file.
 * 6. Respond with 201 Created and the new enrollment object.
 * Errors (e.g. missing body, already enrolled) are sent via next(error) with statusCode 400.
 */
async function enrollUser(req, res, next) {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      const error = new Error('userId and courseId are required');
      error.statusCode = 400;
      return next(error);
    }

    const created = await Enrollment.create({
      userId: Number(userId),
      courseId: Number(courseId),
      enrolledAt: new Date()
    });

    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 400;
      err.message = 'Already enrolled in this course';
    }
    next(err);
  }
}

/**
 * getEnrollments - GET /enrollments
 * ---------------------------------
 * Returns the list of enrollments. Optional query ?userId=1 filters to enrollments for that user.
 * Steps: 1) Read from file. 2) If userId query present, filter. 3) Send array as JSON.
 */
async function getEnrollments(req, res, next) {
  try {
    const userId = req.query.userId;
    const filter = userId ? { userId: Number(userId) } : {};
    const list = await Enrollment.find(filter).sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  enrollUser,
  getEnrollments
};
