const Creature = require('../models/Creature');

const findById = async (id) => {
  return await Creature.findById(id);
};

const findByName = async (name) => {
  return await Creature.findOne({ name });
};

const findAll = async () => {
  return await Creature.find();
};

const create = async (data) => {
  const creature = new Creature(data);
  return await creature.save();
};

module.exports = { findById, findByName, findAll, create };
