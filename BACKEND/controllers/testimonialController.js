const Testimonial = require('../models/Testimonial');

/**
 * getTestimonials - GET /testimonials
 * ----------------------------------
 * Reads the testimonials JSON file, parses it, and sends the array to the client.
 * If the file read or parse fails, the error is passed to next(err) and the global errorHandler responds.
 */
async function getTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean().exec();
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTestimonials };
