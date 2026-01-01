const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const config = require('./config');

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Setup EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Setup
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

// Passport.js Setup
require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/admin/users', require('./routes/userRoutes'));
app.use('/admin/courses', require('./routes/courseRoutes'));

// Dashboard Route
app.get('/admin', (req, res) => {
  res.render('dashboard');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
