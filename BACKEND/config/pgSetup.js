/**
 * PostgreSQL Table Setup & Seed (Evaluation Only)
 * ================================================
 * Creates relational tables with proper constraints (PK, FK, UNIQUE)
 * and seeds sample data for evaluation/demo purposes.
 *
 * Tables:
 *   pg_users        — mirrors user data (demonstrates VARCHAR, UNIQUE, DEFAULT)
 *   pg_courses      — mirrors course data (demonstrates NUMERIC, CHECK)
 *   pg_enrollments  — user–course relationship (demonstrates FK, composite unique)
 *   pg_evaluations  — evaluation scores/feedback (demonstrates FK, CHECK, TEXT)
 *
 * This does NOT touch MongoDB at all.
 */

const { getPgPool } = require('./pg');

async function setupPgTables() {
  const pool = getPgPool();
  if (!pool) return;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Users table ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS pg_users (
        id          SERIAL PRIMARY KEY,
        username    VARCHAR(100) NOT NULL UNIQUE,
        email       VARCHAR(255) NOT NULL UNIQUE,
        role        VARCHAR(50) DEFAULT 'student',
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ── Courses table ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS pg_courses (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        category    VARCHAR(100),
        price       NUMERIC(10,2) DEFAULT 0.00 CHECK (price >= 0),
        level       VARCHAR(100),
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ── Enrollments table (FK → users, courses) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS pg_enrollments (
        id          SERIAL PRIMARY KEY,
        user_id     INT NOT NULL REFERENCES pg_users(id) ON DELETE CASCADE,
        course_id   INT NOT NULL REFERENCES pg_courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      );
    `);

    // ── Evaluations table (FK → users, courses) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS pg_evaluations (
        id            SERIAL PRIMARY KEY,
        user_id       INT NOT NULL REFERENCES pg_users(id) ON DELETE CASCADE,
        course_id     INT NOT NULL REFERENCES pg_courses(id) ON DELETE CASCADE,
        score         INT CHECK (score >= 0 AND score <= 100),
        feedback      TEXT,
        evaluated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('[PostgreSQL] Evaluation tables created successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[PostgreSQL] Table setup failed:', err.message);
  } finally {
    client.release();
  }
}

async function seedPgData() {
  const pool = getPgPool();
  if (!pool) return;

  // Only seed if pg_users is empty
  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM pg_users');
  if (parseInt(rows[0].count, 10) > 0) {
    console.log('[PostgreSQL] Seed data already exists — skipping.');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Seed Users ──
    await client.query(`
      INSERT INTO pg_users (username, email, role) VALUES
        ('admin',    'admin@studystack.com',    'teacher'),
        ('alice',    'alice@studystack.com',    'student'),
        ('bob',      'bob@studystack.com',      'student'),
        ('charlie',  'charlie@studystack.com',  'student');
    `);

    // ── Seed Courses ──
    await client.query(`
      INSERT INTO pg_courses (title, category, price, level) VALUES
        ('Java Frameworks Masterclass',    'Web Development',    999.00,  'Intermediate · 8 Hours'),
        ('React Development',              'Frontend',          2000.00,  'Beginner · 6 Lectures'),
        ('Operating Systems Fundamentals', 'Computer Science',     0.00,  'Beginner · 6 Lectures');
    `);

    // ── Seed Enrollments ──
    await client.query(`
      INSERT INTO pg_enrollments (user_id, course_id) VALUES
        (2, 1), (2, 2), (3, 2), (3, 3), (4, 1), (4, 3);
    `);

    // ── Seed Evaluations ──
    await client.query(`
      INSERT INTO pg_evaluations (user_id, course_id, score, feedback) VALUES
        (2, 1, 85, 'Great course with practical examples. Learned a lot about Spring and Hibernate.'),
        (2, 2, 92, 'Excellent React content. The hands-on exercises were very helpful.'),
        (3, 2, 78, 'Good course but could use more advanced topics.'),
        (3, 3, 95, 'Amazing free course! OS concepts explained clearly.'),
        (4, 1, 88, 'Well-structured curriculum. The project at the end was challenging but rewarding.'),
        (4, 3, 90, 'Very informative. Memory management section was especially good.');
    `);

    await client.query('COMMIT');
    console.log('[PostgreSQL] Seed data inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[PostgreSQL] Seeding failed:', err.message);
  } finally {
    client.release();
  }
}

module.exports = { setupPgTables, seedPgData };
