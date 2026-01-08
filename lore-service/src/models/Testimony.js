const mongoose = require('mongoose');

const testimonySchema = new mongoose.Schema({
  creatureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creature',
    required: true
  },
  authorId: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'VALIDATED', 'REJECTED'],
    default: 'PENDING'
  },
  validatedBy: {
    type: Number,
    default: null
  },
  validatedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimony', testimonySchema);
