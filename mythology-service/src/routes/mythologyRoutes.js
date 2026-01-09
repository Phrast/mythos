const express = require('express');
const router = express.Router();
const mythologyController = require('../controllers/mythologyController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/stats', authenticate, mythologyController.getStats);
router.get('/classification', authenticate, mythologyController.getClassification);

module.exports = router;
