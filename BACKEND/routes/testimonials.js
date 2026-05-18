/**
 * Testimonials Routes
 * ===================
 * Serves the testimonials data for the Home page (e.g. "What Our Students Say").
 * Mounted at /testimonials, so the only endpoint is GET /testimonials.
 */

const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { requireDb } = require('../middleware/requireDb');

// GET /testimonials - Return array of testimonial objects (name, role, image, text)
router.get('/', requireDb, testimonialController.getTestimonials);

module.exports = router;
