const testimonyRepository = require('../repositories/testimonyRepository');
const creatureRepository = require('../repositories/creatureRepository');
const axios = require('axios');

const updateUserReputation = async (userId, delta, authToken) => {
  try {
    await axios.patch(
      `${process.env.AUTH_SERVICE_URL}/users/${userId}/reputation`,
      { delta },
      { headers: { Authorization: authToken } }
    );
  } catch (error) {
    console.error('Failed to update reputation:', error.message);
  }
};

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

const validateTestimony = async (testimonyId, validatorId, validatorRole, authToken) => {
  const testimony = await testimonyRepository.findById(testimonyId);
  if (!testimony) {
    throw new Error('Testimony not found');
  }

  // Règle : impossible de valider son propre témoignage
  if (testimony.authorId === validatorId) {
    throw new Error('Cannot validate your own testimony');
  }

  const result = await testimonyRepository.updateStatus(testimonyId, 'VALIDATED', validatorId);

  // Réputation : +3 pour validation, +1 bonus si validateur EXPERT
  let reputationDelta = 3;
  if (validatorRole === 'EXPERT') {
    reputationDelta += 1;
  }
  await updateUserReputation(testimony.authorId, reputationDelta, authToken);

  return result;
};

const rejectTestimony = async (testimonyId, validatorId, authToken) => {
  const testimony = await testimonyRepository.findById(testimonyId);
  if (!testimony) {
    throw new Error('Testimony not found');
  }

  // Règle : impossible de rejeter son propre témoignage
  if (testimony.authorId === validatorId) {
    throw new Error('Cannot reject your own testimony');
  }

  const result = await testimonyRepository.updateStatus(testimonyId, 'REJECTED', validatorId);

  // Réputation : -1 pour rejet
  await updateUserReputation(testimony.authorId, -1, authToken);

  return result;
};

module.exports = { createTestimony, getTestimoniesByCreature, validateTestimony, rejectTestimony };
