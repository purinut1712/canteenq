const express = require('express');
const router = express.Router();
const User = require('../models/User');


console.log('AUTH ROUTE LOADED');


// register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = new User({ username, password, role });
    await user.save();
    res.json({ message: 'Register success' });
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});


// login
router.post('/login', async (req, res) => {
console.log('LOGIN HIT');


const { username, password } = req.body;
const user = await User.findOne({ username });


if (!user) {
  return res.status(401).json({ message: 'User not found' });
}


if (password !== user.password) {
  return res.status(401).json({ message: 'Wrong password' });
}


res.json({
  username: user.username,
  role: user.role,
  userId: user._id 
});
});


module.exports = router;