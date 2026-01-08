const testimonyService = require('../services/testimonyService');

const createTestimony = async (req, res) => {
  try {
    const { creatureId, description } = req.body;

    if (!creatureId) {
      return res.status(400).json({ error: 'CreatureId is required' });
    }

    const testimony = await testimonyService.createTestimony(req.user.id, creatureId, description);
    res.status(201).json(testimony);
  } catch (error) {
    if (error.message === 'Description is required') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Creature not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Must wait 5 minutes between testimonies on same creature') {
      return res.status(429).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTestimoniesByCreature = async (req, res) => {
  try {
    const testimonies = await testimonyService.getTestimoniesByCreature(req.params.id);
    res.json(testimonies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const validateTestimony = async (req, res) => {
  try {
    const testimony = await testimonyService.validateTestimony(req.params.id, req.user.id);
    res.json(testimony);
  } catch (error) {
    if (error.message === 'Testimony not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Cannot validate your own testimony') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectTestimony = async (req, res) => {
  try {
    const testimony = await testimonyService.rejectTestimony(req.params.id, req.user.id);
    res.json(testimony);
  } catch (error) {
    if (error.message === 'Testimony not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Cannot reject your own testimony') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createTestimony, getTestimoniesByCreature, validateTestimony, rejectTestimony };
