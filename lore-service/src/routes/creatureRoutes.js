const express = require('express');
const router = express.Router();
const creatureController = require('../controllers/creatureController');
const testimonyController = require('../controllers/testimonyController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, creatureController.createCreature);
router.get('/', authenticate, creatureController.getAllCreatures);
router.get('/:id', authenticate, creatureController.getCreature);
router.get('/:id/testimonies', authenticate, testimonyController.getTestimoniesByCreature);

module.exports = router;
