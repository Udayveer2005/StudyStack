/**
 * Items Routes (Dashboard Data)
 * =============================
 * These routes handle CRUD operations for "dashboard items"—the learning tasks
 * or to-do items that each user sees on their Dashboard page.
 *
 * Mounted at /items in server.js. Full URLs:
 * - GET /items - List all items (frontend filters by userId)
 * - GET /items/:id - Get one item by id
 * - POST /items - Create a new item
 * - PUT /items/:id - Update an existing item
 * - DELETE /items/:id - Delete an item
 */

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { requireDb } = require('../middleware/requireDb');

// GET /items - Return all dashboard items
router.get('/', requireDb, itemController.getAllItems);

// GET /items/:id - Return one item by id (route parameter)
router.get('/:id', requireDb, itemController.getItemById);

// POST /items - Create a new item (body: title, description, status, userId)
router.post('/', requireDb, itemController.addItem);

// PUT /items/:id - Update an existing item (body: fields to update)
router.put('/:id', requireDb, itemController.updateItem);

// DELETE /items/:id - Remove an item
router.delete('/:id', requireDb, itemController.deleteItem);

module.exports = router;
