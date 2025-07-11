const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.post('/optimize', budgetController.optimizeBudget);

router.post('/', budgetController.saveBudget);

router.get('/latest', budgetController.getLatestBudget);

module.exports = router; 