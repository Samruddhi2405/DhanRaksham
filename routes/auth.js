const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // ✅ SIGN JWT with { id: ... }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ SIGN JWT with { id: ... }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
