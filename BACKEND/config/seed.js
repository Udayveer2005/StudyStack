const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Course = require('../models/Course');
const Item = require('../models/Item');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Testimonial = require('../models/Testimonial');

async function readJson(relPath) {
  const p = path.join(__dirname, '..', relPath);
  const raw = await fs.readFile(p, 'utf-8');
  return JSON.parse(raw);
}

async function seedIfEmpty() {
  const counts = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Item.countDocuments(),
    Enrollment.countDocuments(),
    Progress.countDocuments(),
    Testimonial.countDocuments()
  ]);

  const [userCount, courseCount, itemCount, enrollmentCount, progressCount, testimonialCount] = counts;
  if (userCount || courseCount || itemCount || enrollmentCount || progressCount || testimonialCount) {
    const [courses] = await Promise.all([readJson('data/courses.json')]);

    await Promise.all(
      (courses || []).map(async (c) => {
        const update = {};
        if (c.isFree !== undefined) update.isFree = Boolean(c.isFree);
        if (Array.isArray(c.lectures)) update.lectures = c.lectures;
        if (Object.keys(update).length > 0) {
          await Course.updateOne({ legacyId: c.id }, { $set: update }).exec();
        }
      })
    );

    return;
  }

  const [users, courses, items, enrollments, progress, testimonials] = await Promise.all([
    readJson('data/users.json'),
    readJson('data/courses.json'),
    readJson('data/items.json'),
    readJson('data/enrollments.json'),
    readJson('data/progress.json'),
    readJson('data/testimonials.json')
  ]);

  // Users (hash legacy plaintext password field)
  for (const u of users || []) {
    const passwordHash = await bcrypt.hash(String(u.password || 'password'), 10);
    await User.create({
      legacyId: u.id,
      username: u.username,
      email: u.email,
      passwordHash,
      roles: u.roles || ['user']
    });
  }

  for (const c of courses || []) {
    await Course.create({
      legacyId: c.id,
      title: c.title,
      category: c.category,
      price: Number(c.price),
      level: c.level || '',
      isFree: Boolean(c.isFree),
      lectures: Array.isArray(c.lectures) ? c.lectures : undefined
    });
  }

  for (const i of items || []) {
    await Item.create({
      legacyId: i.id,
      title: i.title,
      description: i.description,
      status: i.status || 'pending',
      userId: Number(i.userId)
    });
  }

  for (const e of enrollments || []) {
    await Enrollment.create({
      userId: Number(e.userId),
      courseId: Number(e.courseId),
      enrolledAt: e.enrolledAt ? new Date(e.enrolledAt) : new Date()
    });
  }

  for (const p of progress || []) {
    await Progress.create({
      userId: Number(p.userId),
      courseId: Number(p.courseId),
      completedLectureIds: Array.isArray(p.completedLectureIds) ? p.completedLectureIds.map(Number) : []
    });
  }

  for (const t of testimonials || []) {
    await Testimonial.create({
      name: t.name || t.studentName || 'Student',
      course: t.course || '',
      rating: Number(t.rating || 5),
      message: t.message || t.text || ''
    });
  }
}

module.exports = { seedIfEmpty };

