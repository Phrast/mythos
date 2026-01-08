const express = require('express');
const router = express.Router();
const testimonyController = require('../controllers/testimonyController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.post('/', authenticate, testimonyController.createTestimony);
router.post('/:id/validate', authenticate, requireRole('EXPERT', 'ADMIN'), testimonyController.validateTestimony);
router.post('/:id/reject', authenticate, requireRole('EXPERT', 'ADMIN'), testimonyController.rejectTestimony);

module.exports = router;
