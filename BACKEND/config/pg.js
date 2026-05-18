/**
 * PostgreSQL Connection Pool (Evaluation Database)
 * =================================================
 * This file creates a connection pool to a PostgreSQL database
 * used ONLY for evaluation purposes. The main application data
 * continues to use MongoDB via Mongoose (see db.js).
 *
 * Both databases run independently — PostgreSQL handles evaluation
 * tables while MongoDB handles everything else.
 */

const { Pool } = require('pg');

let pool = null;

/**
 * connectPg()
 * Creates and returns a PostgreSQL connection pool.
 * Uses PG_CONNECTION_STRING from environment variables.
 */
function connectPg() {
  const connectionString = process.env.PG_CONNECTION_STRING;
  if (!connectionString) {
    console.warn('[PostgreSQL] PG_CONNECTION_STRING not set — PostgreSQL features disabled.');
    return null;
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },   // Required for Render-hosted PostgreSQL
    max: 5,                                // Max 5 connections in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  });

  pool.on('error', (err) => {
    console.error('[PostgreSQL] Unexpected pool error:', err.message);
  });

  return pool;
}

/**
 * getPgPool()
 * Returns the existing pool instance (or null if not connected).
 */
function getPgPool() {
  return pool;
}

module.exports = { connectPg, getPgPool };
