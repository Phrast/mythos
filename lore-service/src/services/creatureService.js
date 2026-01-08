const creatureRepository = require('../repositories/creatureRepository');
const testimonyRepository = require('../repositories/testimonyRepository');

const calculateLegendScore = (validatedTestimoniesCount) => {
  return 1 + validatedTestimoniesCount / 5;
};

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

  const validatedCount = await testimonyRepository.countValidatedByCreatureId(id);
  const creatureObj = creature.toObject();
  creatureObj.legendScore = calculateLegendScore(validatedCount);

  return creatureObj;
};

const getAllCreatures = async (sortBy = null) => {
  const creatures = await creatureRepository.findAll();

  const creaturesWithScore = await Promise.all(
    creatures.map(async (creature) => {
      const validatedCount = await testimonyRepository.countValidatedByCreatureId(creature._id);
      const creatureObj = creature.toObject();
      creatureObj.legendScore = calculateLegendScore(validatedCount);
      return creatureObj;
    })
  );

  if (sortBy === 'legendScore') {
    creaturesWithScore.sort((a, b) => b.legendScore - a.legendScore);
  }

  return creaturesWithScore;
};

module.exports = { createCreature, getCreatureById, getAllCreatures };
