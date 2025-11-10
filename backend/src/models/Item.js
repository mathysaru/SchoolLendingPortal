const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'general' },
  condition: { type: String, enum: ['new','good','fair','poor'], default: 'good' },
  quantity: { type: Number, default: 1 },
  images: { type: [String], default: [] },
  description: { type: String, default: '' },
  available:{type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
