const express = require('express');
const router = express.Router();

const creatureRoutes = require('./creatureRoutes');
const testimonyRoutes = require('./testimonyRoutes');

router.use('/creatures', creatureRoutes);
router.use('/testimonies', testimonyRoutes);

module.exports = router;
