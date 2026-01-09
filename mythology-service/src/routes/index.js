const express = require('express');
const router = express.Router();

const mythologyRoutes = require('./mythologyRoutes');

router.use('/mythology', mythologyRoutes);

module.exports = router;
