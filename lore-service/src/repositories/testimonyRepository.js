const Testimony = require('../models/Testimony');

const findById = async (id) => {
  return await Testimony.findById(id);
};

const findByCreatureId = async (creatureId) => {
  return await Testimony.find({ creatureId });
};

const findRecentByAuthorAndCreature = async (authorId, creatureId, minutes) => {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return await Testimony.findOne({
    authorId,
    creatureId,
    createdAt: { $gte: since }
  });
};

const create = async (data) => {
  const testimony = new Testimony(data);
  return await testimony.save();
};

const updateStatus = async (id, status, validatedBy) => {
  return await Testimony.findByIdAndUpdate(
    id,
    { status, validatedBy, validatedAt: new Date() },
    { new: true }
  );
};

const countValidatedByCreatureId = async (creatureId) => {
  return await Testimony.countDocuments({ creatureId, status: 'VALIDATED' });
};

module.exports = { findById, findByCreatureId, findRecentByAuthorAndCreature, create, updateStatus, countValidatedByCreatureId };
