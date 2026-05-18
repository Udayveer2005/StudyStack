const express = require('express');
const router = express.Router();
const { requireDb } = require('../middleware/requireDb');
const { requireAuth, requireRole } = require('../middleware/auth');
const testController = require('../controllers/testController');

router.get('/', requireDb, testController.getTests);
router.post('/', requireDb, requireAuth, requireRole('teacher', 'admin'), testController.createTest);
router.post('/:testId/submit', requireDb, requireAuth, requireRole('student', 'user'), testController.submitTest);

router.get(
  '/submissions/me',
  requireDb,
  requireAuth,
  requireRole('student', 'user'),
  testController.getMySubmissions
);

router.get(
  '/submissions',
  requireDb,
  requireAuth,
  requireRole('teacher', 'admin'),
  testController.getAllSubmissions
);

router.patch(
  '/submissions/:submissionId/grade',
  requireDb,
  requireAuth,
  requireRole('teacher', 'admin'),
  testController.gradeSubmission
);

module.exports = router;
