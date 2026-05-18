/**
 * Users Routes
 * ============
 * Defines endpoints for user-related operations. Mounted in server.js at /users.
 * Full URLs: GET /users, POST /users, POST /users/login, POST /users/register
 *
 * Note: We also have POST /login and POST /register at the root level in server.js
 * so the frontend can call exactly /login and /register.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - Return all users (e.g. for SignUp to check if username/email exists)
router.get('/', userController.getUsers);

// POST /users - Register a new user (alternative to POST /register)
router.post('/', userController.register);

// POST /users/login - Login (alternative to POST /login)
router.post('/login', userController.login);

// POST /users/register - Register (alternative to POST /register)
router.post('/register', userController.register);

module.exports = router;
