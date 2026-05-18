const User = require('../models/User');
const authController = require('./authController');

/**
 * getUsers - GET /users
 * ---------------------
 * Returns all users (array). Used by the frontend SignUp page to check if username/email already exists.
 * Steps: read file -> parse JSON -> res.json(users).
 */
async function getUsers(req, res, next) {
  try {
    const users = await User.find({}, { passwordHash: 0, refreshTokenHashes: 0 })
      .sort({ legacyId: 1 })
      .lean()
      .exec();

    // Keep shape similar to old JSON (id, username, email)
    res.json(
      users.map((u) => ({
        id: u.legacyId,
        username: u.username,
        email: u.email,
        roles: u.roles
      }))
    );
  } catch (err) {
    next(err);
  }
}

/**
 * login - POST /login
 * ------------------
 * Authenticates a user. Body: { username, password }.
 * Steps:
 * 1. Validate username and password are present (return 400 if not).
 * 2. Read users from file.
 * 3. Find user where username and password match.
 * 4. If not found, call next(error) with statusCode 401 (Unauthorized).
 * 5. If found, send back user info without password: { id, username, email }.
 * The client uses this to store userId in localStorage and redirect to dashboard.
 */
async function login(req, res, next) {
  return authController.login(req, res, next);
}

/**
 * register - POST /register (or POST /users)
 * ------------------------------------------
 * Creates a new user. Body: { username, email, password }.
 * Steps:
 * 1. Validate required fields.
 * 2. Read users, check if username or email already exists (return 400 if duplicate).
 * 3. Generate new id, push new user to array (password is stored in plain text for this demo; in production we would hash it).
 * 4. Write users back to file.
 * 5. Respond with 201 and the new user (without password).
 */
async function register(req, res, next) {
  return authController.register(req, res, next);
}

module.exports = {
  getUsers,
  login,
  register
};
