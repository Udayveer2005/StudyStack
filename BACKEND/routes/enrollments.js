/**
 * Enrollments Routes
 * ==================
 * Defines endpoints for course enrollments (user enrolled in which course).
 * In our server.js we mount the enrollment controller directly for POST /enroll
 * and GET /enrollments, so this router file is available for reference; the
 * actual used routes are defined in server.js.
 *
 * Endpoints:
 * - POST /enroll - Enroll a user in a course (body: { userId, courseId })
 * - GET /enrollments - List all enrollments (optional query: ?userId=1 to filter)
 */

const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// POST /enroll - Create a new enrollment (user + course)
router.post('/enroll', enrollmentController.enrollUser);

// GET /enrollments - Get list of enrollments (optionally filtered by userId)
router.get('/enrollments', enrollmentController.getEnrollments);

module.exports = router;
