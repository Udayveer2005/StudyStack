const express = require('express');
const Course = require('../models/Course');
const router = express.Router();
const { requireDb } = require('../middleware/requireDb');

// SSR home page
router.get('/', requireDb, async (req, res, next) => {
  try {
    const featured = await Course.find({}).sort({ createdAt: -1 }).limit(5).lean().exec();
    res.render('pages/home', { featured, now: new Date() });
  } catch (err) {
    next(err);
  }
});

// SSR login page (renders on server)
router.get('/ssr/login', (req, res) => {
  res.render('pages/login', { now: new Date() });
});

// SSR dashboard page (shows session persistence)
router.get('/ssr/dashboard', (req, res) => {
  res.render('pages/dashboard', { session: req.session || null, now: new Date() });
});

// CSR demo page (HTML is server-rendered, but main content is fetched + rendered by browser JS)
router.get('/csr-demo', (req, res) => {
  res.render('pages/csr-demo', { now: new Date() });
});

module.exports = router;

