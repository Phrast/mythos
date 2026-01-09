const statsService = require('../services/statsService');

const getStats = async (req, res) => {
  try {
    const stats = await statsService.generateStats(req.authToken);
    res.json(stats);
  } catch (error) {
    console.error('Error generating stats:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getClassification = async (req, res) => {
  try {
    const classification = await statsService.getClassification(req.authToken);
    res.json(classification);
  } catch (error) {
    console.error('Error getting classification:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStats, getClassification };
