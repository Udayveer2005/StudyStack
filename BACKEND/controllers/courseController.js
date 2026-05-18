const Course = require('../models/Course');

async function getNextCourseLegacyId() {
  const last = await Course.findOne({}, { legacyId: 1 }).sort({ legacyId: -1 }).lean().exec();
  return (last?.legacyId || 0) + 1;
}

/**
 * getAllCourses - GET /courses
 * ----------------------------
 * Returns the full list of courses to the client.
 * Steps: 1) Read from file, 2) Send as JSON. Any error is passed to next(err) so errorHandler can respond.
 */
async function getAllCourses(req, res, next) {
  try {
    // "SQL-like" style query support via query params (WHERE + ORDER + LIMIT)
    const { category, minPrice, maxPrice, q, sortBy = 'createdAt', sortDir = 'desc', limit } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: String(q), $options: 'i' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const sort = { [sortBy]: sortDir === 'asc' ? 1 : -1 };

    const query = Course.find(filter).sort(sort);
    if (limit) query.limit(Math.min(Number(limit), 200));

    const courses = await query.exec();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

/**
 * getCourseById - GET /courses/:id
 * --------------------------------
 * Returns a single course whose id matches the route parameter req.params.id.
 * Steps: 1) Parse id from URL (e.g. /courses/1 -> id=1). 2) Validate it's a number. 3) Find course. 4) If not found, call next(error) with statusCode 404. 5) Otherwise send the course as JSON.
 */
async function getCourseById(req, res, next) {
  try {
    const raw = String(req.params.id);
    const isNumeric = /^\d+$/.test(raw);

    const course = isNumeric
      ? await Course.findOne({ legacyId: Number(raw) }).exec()
      : await Course.findById(raw).exec();
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(course);
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'Invalid course id';
    }
    next(err);
  }
}

/**
 * addCourse - POST /courses
 * -------------------------
 * Adds a new course. Request body should contain title, category, price, and optionally level.
 * Steps: 1) Validate required fields. 2) Read current courses. 3) Generate new id (max existing + 1). 4) Append new course. 5) Write back to file. 6) Send 201 Created and the new course as JSON.
 */
async function addCourse(req, res, next) {
  try {
    const { title, category, price, level } = req.body;
    if (!title || !category || price === undefined) {
      const error = new Error('Title, category and price are required');
      error.statusCode = 400;
      return next(error);
    }

    const legacyId = await getNextCourseLegacyId();
    const created = await Course.create({
      legacyId,
      title,
      category,
      price: Number(price),
      level: level || ''
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse
};

async function updateCourse(req, res, next) {
  try {
    const raw = String(req.params.id);
    const isNumeric = /^\d+$/.test(raw);
    const query = isNumeric ? { legacyId: Number(raw) } : { _id: raw };

    const updated = await Course.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'Invalid course id';
    }
    return next(err);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const raw = String(req.params.id);
    const isNumeric = /^\d+$/.test(raw);
    const query = isNumeric ? { legacyId: Number(raw) } : { _id: raw };

    const deleted = await Course.findOneAndDelete(query).exec();
    if (!deleted) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      return next(error);
    }
    return res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'Invalid course id';
    }
    return next(err);
  }
}
