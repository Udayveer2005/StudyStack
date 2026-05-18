/**
 * Progress Routes
 * ===============
 * Endpoints for per-user course progress.
 * Mounted under /progress in server.js.
 *
 * - GET /progress?userId=&courseId=  -> get progress for a single user+course
 * - POST /progress                   -> create/update progress record
 */

const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { requireDb } = require('../middleware/requireDb');

router.get('/', requireDb, progressController.getUserCourseProgress);
router.post('/', requireDb, progressController.upsertUserCourseProgress);

module.exports = router;

