const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireDb } = require('../middleware/requireDb');

router.post('/register', requireDb, authController.register);
router.post('/login', requireDb, authController.login);
router.post('/refresh', requireDb, authController.refresh);
router.post('/logout', requireDb, authController.logout);

// Role-based demo endpoint (RBAC)
router.get('/me', requireDb, requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

router.get('/admin-only', requireDb, requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: 'Hello admin. Sensitive data here.' });
});

router.get('/moderator-or-admin', requireDb, requireAuth, requireRole('moderator', 'admin'), (req, res) => {
  res.json({ message: 'Hello moderator/admin.' });
});

module.exports = router;

