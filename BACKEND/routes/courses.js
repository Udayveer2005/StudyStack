/**
 * Courses Routes
 * ==============
 * This file is responsible for defining the URL paths (endpoints) that relate to courses.
 * It does NOT contain business logic—that lives in the courseController.
 * When a request matches one of these paths, Express calls the corresponding controller function.
 *
 * Base path: /courses (because we mount this router in server.js as app.use('/courses', courseRoutes))
 * So the full URLs are: GET /courses, GET /courses/:id, POST /courses, PUT /courses/:id, DELETE /courses/:id
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { requireDb } = require('../middleware/requireDb');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /courses - Return all courses (used by Course page to display the list)
router.get('/', requireDb, courseController.getAllCourses);

// GET /courses/:id - Return a single course by id (e.g. /courses/1). :id is a route parameter.
router.get('/:id', requireDb, courseController.getCourseById);

router.post(
  '/',
  requireDb,
  requireAuth,
  requireRole('teacher', 'admin'),
  courseController.addCourse
);

router.put(
  '/:id',
  requireDb,
  requireAuth,
  requireRole('teacher', 'admin'),
  courseController.updateCourse
);

router.delete(
  '/:id',
  requireDb,
  requireAuth,
  requireRole('teacher', 'admin'),
  courseController.deleteCourse
);

module.exports = router;
