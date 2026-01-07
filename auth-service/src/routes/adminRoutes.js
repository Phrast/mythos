const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.get('/users', authenticate, requireRole('ADMIN'), adminController.getAllUsers);

module.exports = router;
