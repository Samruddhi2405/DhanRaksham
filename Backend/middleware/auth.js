const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Public: Register route
router.post('/register', async (req, res) => {
  // your register logic
});

// Public: Login route
router.post('/login', async (req, res) => {
  // your login logic
});

module.exports = router;
