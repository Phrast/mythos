const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.patch('/:id/role', authenticate, requireRole('ADMIN'), adminController.updateUserRole);

module.exports = router;
