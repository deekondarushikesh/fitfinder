const express = require('express');
const { generateTryOn } = require('../controllers/vtoController');

const router = express.Router();

router.post('/generate', generateTryOn);

module.exports = router;
