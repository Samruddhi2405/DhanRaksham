const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Route to get financial advice
router.post('/advice', chatbotController.getAdvice);

module.exports = router; 