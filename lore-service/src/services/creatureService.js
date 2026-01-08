const creatureRepository = require('../repositories/creatureRepository');

const createCreature = async (authorId, name, origin) => {
  // Règle : nom unique
  const existing = await creatureRepository.findByName(name);
  if (existing) {
    throw new Error('Creature name already exists');
  }

  return await creatureRepository.create({ authorId, name, origin });
};

const getCreatureById = async (id) => {
  const creature = await creatureRepository.findById(id);
  if (!creature) {
    throw new Error('Creature not found');
  }
  return creature;
};

const getAllCreatures = async () => {
  return await creatureRepository.findAll();
};

module.exports = { createCreature, getCreatureById, getAllCreatures };
