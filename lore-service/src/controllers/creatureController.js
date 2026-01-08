const creatureService = require('../services/creatureService');

const createCreature = async (req, res) => {
  try {
    const { name, origin } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const creature = await creatureService.createCreature(req.user.id, name, origin);
    res.status(201).json(creature);
  } catch (error) {
    if (error.message === 'Creature name already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCreature = async (req, res) => {
  try {
    const creature = await creatureService.getCreatureById(req.params.id);
    res.json(creature);
  } catch (error) {
    if (error.message === 'Creature not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllCreatures = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const creatures = await creatureService.getAllCreatures(sortBy);
    res.json(creatures);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createCreature, getCreature, getAllCreatures };
