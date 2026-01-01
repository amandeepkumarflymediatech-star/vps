const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// List all users
router.get('/', (req, res) => {
  User.find()
    .then(users => res.render('users', { users }))
    .catch(err => res.status(500).send(err));
});

// Create a new user (admin only)
router.post('/create', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  
  newUser.save()
    .then(() => res.redirect('/admin/users'))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
