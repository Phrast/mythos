const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema({
  authorId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  origin: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Creature', creatureSchema);
