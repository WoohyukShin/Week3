// server/routers/user.js
const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/config');

// POST /api/users/register - 회원가입
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

// POST /api/users/login - 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/ranking - 랭킹 조회
router.get('/ranking', async (req, res) => {
  try {
    // highScore를 기준으로 내림차순 정렬하고 상위 10명만 조회
    const topUsers = await User.find().sort({ highScore: -1 }).limit(10).select('username highScore');
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
