const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.post('/optimize', budgetController.optimizeBudget);

module.exports = router; 