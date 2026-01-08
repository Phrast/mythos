const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.patch('/:id/role', authenticate, requireRole('ADMIN'), adminController.updateUserRole);
router.patch('/:id/reputation', authenticate, requireRole('EXPERT', 'ADMIN'), adminController.updateUserReputation);

module.exports = router;
