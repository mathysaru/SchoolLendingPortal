const express = require("express");
const Joi = require("joi");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");
const Item = require("../models/Item");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().allow("").optional(),
  condition: Joi.string().valid("new", "good", "fair", "poor").optional(),
  quantity: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  description: Joi.string().allow("").optional(),
}).unknown(true);

// list items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().lean().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error listing items" });
  }
});

// create (admin)
router.post("/", auth, roles(["admin"]), async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const item = await Item.create(value);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating item" });
  }
});

// update
router.put("/:id", auth, roles(["admin"]), async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const item = await Item.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// delete
router.delete("/:id", auth, roles(["admin"]), async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error deleting item" });
  }
});

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Equipment management
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all equipment items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   available:
 *                     type: boolean
 */

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 *       404:
 *         description: Item not found
 */
/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Add a new equipment item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an existing equipment item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an equipment item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */


module.exports = router;
