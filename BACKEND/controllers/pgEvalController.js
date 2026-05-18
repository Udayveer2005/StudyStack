/**
 * PostgreSQL Evaluation Controller
 * =================================
 * CRUD operations on the PostgreSQL evaluation tables.
 * These endpoints are completely independent of MongoDB.
 *
 * Demonstrates:  SELECT, INSERT, UPDATE, DELETE, JOIN, aggregate queries
 */

const { getPgPool } = require('../config/pg');

// ── Helper: return 503 if PostgreSQL is not connected ──
function requirePg(req, res) {
  const pool = getPgPool();
  if (!pool) {
    res.status(503).json({ message: 'PostgreSQL is not configured.' });
    return null;
  }
  return pool;
}

// ═══════════════════════════════════════
//  PG_USERS  —  CRUD
// ═══════════════════════════════════════

/** GET /pg/users — List all users */
async function getUsers(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rows } = await pool.query('SELECT * FROM pg_users ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/** POST /pg/users — Create a user */
async function createUser(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  const { username, email, role } = req.body;
  if (!username || !email) return res.status(400).json({ message: 'username and email are required.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO pg_users (username, email, role) VALUES ($1, $2, $3) RETURNING *',
      [username, email, role || 'student']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Username or email already exists.' });
    res.status(500).json({ message: err.message });
  }
}

// ═══════════════════════════════════════
//  PG_COURSES  —  CRUD
// ═══════════════════════════════════════

/** GET /pg/courses — List all courses */
async function getCourses(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rows } = await pool.query('SELECT * FROM pg_courses ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/** POST /pg/courses — Create a course */
async function createCourse(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  const { title, category, price, level } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO pg_courses (title, category, price, level) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category || null, price || 0, level || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ═══════════════════════════════════════
//  PG_ENROLLMENTS  —  CRUD + JOIN
// ═══════════════════════════════════════

/** GET /pg/enrollments — List enrollments with user + course names (JOIN) */
async function getEnrollments(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rows } = await pool.query(`
      SELECT
        e.id,
        e.user_id,
        u.username,
        e.course_id,
        c.title AS course_title,
        e.enrolled_at
      FROM pg_enrollments e
      JOIN pg_users   u ON u.id = e.user_id
      JOIN pg_courses c ON c.id = e.course_id
      ORDER BY e.enrolled_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/** POST /pg/enrollments — Enroll a user in a course */
async function createEnrollment(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  const { user_id, course_id } = req.body;
  if (!user_id || !course_id) return res.status(400).json({ message: 'user_id and course_id are required.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO pg_enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *',
      [user_id, course_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'User is already enrolled in this course.' });
    if (err.code === '23503') return res.status(404).json({ message: 'User or course not found.' });
    res.status(500).json({ message: err.message });
  }
}

/** DELETE /pg/enrollments/:id — Remove an enrollment */
async function deleteEnrollment(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rowCount } = await pool.query('DELETE FROM pg_enrollments WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Enrollment not found.' });
    res.json({ message: 'Enrollment removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ═══════════════════════════════════════
//  PG_EVALUATIONS  —  CRUD + Aggregation
// ═══════════════════════════════════════

/** GET /pg/evaluations — List evaluations with user + course details (JOIN) */
async function getEvaluations(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rows } = await pool.query(`
      SELECT
        ev.id,
        ev.user_id,
        u.username,
        ev.course_id,
        c.title AS course_title,
        ev.score,
        ev.feedback,
        ev.evaluated_at
      FROM pg_evaluations ev
      JOIN pg_users   u ON u.id = ev.user_id
      JOIN pg_courses c ON c.id = ev.course_id
      ORDER BY ev.evaluated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/** POST /pg/evaluations — Submit an evaluation */
async function createEvaluation(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  const { user_id, course_id, score, feedback } = req.body;
  if (!user_id || !course_id) return res.status(400).json({ message: 'user_id and course_id are required.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO pg_evaluations (user_id, course_id, score, feedback) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, course_id, score || null, feedback || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(404).json({ message: 'User or course not found.' });
    res.status(500).json({ message: err.message });
  }
}

/** PUT /pg/evaluations/:id — Update an evaluation */
async function updateEvaluation(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  const { score, feedback } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      'UPDATE pg_evaluations SET score = COALESCE($1, score), feedback = COALESCE($2, feedback) WHERE id = $3 RETURNING *',
      [score, feedback, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Evaluation not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/** DELETE /pg/evaluations/:id — Delete an evaluation */
async function deleteEvaluation(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rowCount } = await pool.query('DELETE FROM pg_evaluations WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Evaluation not found.' });
    res.json({ message: 'Evaluation deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ═══════════════════════════════════════
//  AGGREGATE STATS (demonstrates GROUP BY, AVG, COUNT)
// ═══════════════════════════════════════

/** GET /pg/stats — Course statistics (avg score, enrollment count) */
async function getStats(req, res) {
  const pool = requirePg(req, res);
  if (!pool) return;
  try {
    const { rows } = await pool.query(`
      SELECT
        c.id AS course_id,
        c.title,
        c.category,
        COUNT(DISTINCT e.user_id)   AS enrolled_students,
        COUNT(DISTINCT ev.id)       AS total_evaluations,
        ROUND(AVG(ev.score), 1)     AS avg_score
      FROM pg_courses c
      LEFT JOIN pg_enrollments e  ON e.course_id  = c.id
      LEFT JOIN pg_evaluations ev ON ev.course_id = c.id
      GROUP BY c.id, c.title, c.category
      ORDER BY avg_score DESC NULLS LAST
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getUsers, createUser,
  getCourses, createCourse,
  getEnrollments, createEnrollment, deleteEnrollment,
  getEvaluations, createEvaluation, updateEvaluation, deleteEvaluation,
  getStats
};
