const testimonyRepository = require('../repositories/testimonyRepository');
const creatureRepository = require('../repositories/creatureRepository');

const createTestimony = async (authorId, creatureId, description) => {
  // Règle : description obligatoire
  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }

  // Vérifier que la créature existe
  const creature = await creatureRepository.findById(creatureId);
  if (!creature) {
    throw new Error('Creature not found');
  }

  // Règle : délai de 5 minutes entre témoignages sur même créature
  const recent = await testimonyRepository.findRecentByAuthorAndCreature(authorId, creatureId, 5);
  if (recent) {
    throw new Error('Must wait 5 minutes between testimonies on same creature');
  }

  return await testimonyRepository.create({ authorId, creatureId, description });
};

const getTestimoniesByCreature = async (creatureId) => {
  return await testimonyRepository.findByCreatureId(creatureId);
};

const validateTestimony = async (testimonyId, validatorId) => {
  const testimony = await testimonyRepository.findById(testimonyId);
  if (!testimony) {
    throw new Error('Testimony not found');
  }

  // Règle : impossible de valider son propre témoignage
  if (testimony.authorId === validatorId) {
    throw new Error('Cannot validate your own testimony');
  }

  return await testimonyRepository.updateStatus(testimonyId, 'VALIDATED', validatorId);
};

const rejectTestimony = async (testimonyId, validatorId) => {
  const testimony = await testimonyRepository.findById(testimonyId);
  if (!testimony) {
    throw new Error('Testimony not found');
  }

  // Règle : impossible de rejeter son propre témoignage
  if (testimony.authorId === validatorId) {
    throw new Error('Cannot reject your own testimony');
  }

  return await testimonyRepository.updateStatus(testimonyId, 'REJECTED', validatorId);
};

module.exports = { createTestimony, getTestimoniesByCreature, validateTestimony, rejectTestimony };
