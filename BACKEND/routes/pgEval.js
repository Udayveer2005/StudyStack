/**
 * PostgreSQL Evaluation Routes
 * =============================
 * All routes are mounted under /pg in server.js.
 * These are completely independent of the MongoDB routes.
 *
 * Endpoints:
 *   GET/POST        /pg/users
 *   GET/POST        /pg/courses
 *   GET/POST        /pg/enrollments
 *   DELETE           /pg/enrollments/:id
 *   GET/POST        /pg/evaluations
 *   PUT/DELETE       /pg/evaluations/:id
 *   GET              /pg/stats
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pgEvalController');

// ── Users ──
router.get('/users',   ctrl.getUsers);
router.post('/users',  ctrl.createUser);

// ── Courses ──
router.get('/courses',   ctrl.getCourses);
router.post('/courses',  ctrl.createCourse);

// ── Enrollments (with JOIN) ──
router.get('/enrollments',      ctrl.getEnrollments);
router.post('/enrollments',     ctrl.createEnrollment);
router.delete('/enrollments/:id', ctrl.deleteEnrollment);

// ── Evaluations (full CRUD) ──
router.get('/evaluations',         ctrl.getEvaluations);
router.post('/evaluations',        ctrl.createEvaluation);
router.put('/evaluations/:id',     ctrl.updateEvaluation);
router.delete('/evaluations/:id',  ctrl.deleteEvaluation);

// ── Aggregate Stats ──
router.get('/stats', ctrl.getStats);

module.exports = router;
