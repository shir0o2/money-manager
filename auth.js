const express = require('express');
const router = express.Router();
const { readDB } = require('../server');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ 
      success: true, 
      user: { name: user.name, username: user.username } 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;