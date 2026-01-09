const axios = require('axios');

const getCreatures = async (authToken) => {
  const response = await axios.get(`${process.env.LORE_SERVICE_URL}/creatures`, {
    headers: { Authorization: authToken }
  });
  return response.data;
};

const getTestimoniesByCreature = async (creatureId, authToken) => {
  const response = await axios.get(`${process.env.LORE_SERVICE_URL}/creatures/${creatureId}/testimonies`, {
    headers: { Authorization: authToken }
  });
  return response.data;
};

const getAllTestimonies = async (creatures, authToken) => {
  const testimoniesMap = {};

  await Promise.all(
    creatures.map(async (creature) => {
      try {
        const testimonies = await getTestimoniesByCreature(creature._id, authToken);
        testimoniesMap[creature._id] = testimonies;
      } catch (error) {
        testimoniesMap[creature._id] = [];
      }
    })
  );

  return testimoniesMap;
};

module.exports = { getCreatures, getTestimoniesByCreature, getAllTestimonies };
