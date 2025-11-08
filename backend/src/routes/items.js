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

module.exports = router;
