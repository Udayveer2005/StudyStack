const Item = require('../models/Item');

async function getNextItemLegacyId() {
  const last = await Item.findOne({}, { legacyId: 1 }).sort({ legacyId: -1 }).lean().exec();
  return (last?.legacyId || 0) + 1;
}

/**
 * getAllItems - GET /items
 * Returns all items. The frontend then filters by userId to show only the logged-in user's items.
 */
async function getAllItems(req, res, next) {
  try {
    const { userId, status } = req.query;
    const filter = {};
    if (userId !== undefined) filter.userId = Number(userId);
    if (status) filter.status = status;

    const items = await Item.find(filter).sort({ createdAt: -1 }).exec();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

/**
 * getItemById - GET /items/:id
 * Returns one item by id. Returns 404 if not found.
 */
async function getItemById(req, res, next) {
  try {
    const raw = String(req.params.id);
    const isNumeric = /^\d+$/.test(raw);

    const item = isNumeric
      ? await Item.findOne({ legacyId: Number(raw) }).exec()
      : await Item.findById(raw).exec();
    if (!item) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(item);
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'Invalid item id';
    }
    next(err);
  }
}

/**
 * addItem - POST /items
 * Creates a new item. Body must include title and userId; description and status are optional.
 * Steps: validate -> read file -> generate id -> push -> write file -> respond 201 with new item.
 */
async function addItem(req, res, next) {
  try {
    const { title, description, status, userId } = req.body;
    if (!title || userId === undefined) {
      const error = new Error('Title and userId are required');
      error.statusCode = 400;
      return next(error);
    }

    const legacyId = await getNextItemLegacyId();
    const created = await Item.create({
      legacyId,
      title: title || '',
      description: description || '',
      status: status || 'pending',
      userId: Number(userId)
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * updateItem - PUT /items/:id
 * Updates an existing item. Merges req.body into the item; id is kept from the URL.
 * Returns 404 if id not found. Then writes updated array to file and sends updated item as JSON.
 */
async function updateItem(req, res, next) {
  try {
    const raw = String(req.params.id);
    const isNumeric = /^\d+$/.test(raw);

    const query = isNumeric ? { legacyId: Number(raw) } : { _id: raw };
    const updated = await Item.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'Invalid item id';
    }
    next(err);
  }
}

/**
 * deleteItem - DELETE /items/:id
 * Removes the item with the given id from the array, writes file, sends 204 No Content (empty body).
 */
async function deleteItem(req, res, next) {
  try {
    const raw = String(req.params.id);
    const isNumeric = /^\d+$/.test(raw);

    const query = isNumeric ? { legacyId: Number(raw) } : { _id: raw };
    const deleted = await Item.findOneAndDelete(query).exec();
    if (!deleted) {
      const error = new Error('Item not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'Invalid item id';
    }
    next(err);
  }
}

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem
};
