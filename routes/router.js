const express = require('express');
const router = express.Router();
const User = require('../models/users');

// GET login
router.post('/login', (req, res, next) => {
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
      if (error || !user) {
        let err = new Error('Wrong email or password.');
        err.status = 401;
        // return next(err);
        return res.json({ status: false, message: err.message });
      } else {
        req.session.userId = user._id;
        console.log(`/login -> session: ${JSON.stringify(req.session)}\n`);
        console.log(`/login -> userId: ${req.session.userId}\n`);
        return res.json({ status: true, message: 'User logged in.' });
        // return res.redirect('/profile');
      }
    })
  } else {
    res.status = 400;
    return res.json({ status: false, message: 'Error: All fields required.' });
  }
});

// POST for create_user
router.post('/create_user', (req, res, next) => {
  if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {

    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    };

    // use schema.create to inser data into db
    User.create(userData, function(err, user) {
      if (err) {
        res.status = 401;
        return res.json({ status: false, message: `Error: ${err}` });
      }
      req.session.userId = user._id;
      res.status = 201;
      return res.json({ status: true, message: 'User created' });
    });
  } else {
    res.status = 400;
    return res.json({ status: false, message: 'Error: All fields required.' });
  }
});


const requiresLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    let err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
};


// GET for profile view
router.get('/profile', (req, res, next) => {
  console.log(`/profile -> session: ${JSON.stringify(req.session)}\n`);
  console.log(`/profile -> userId: ${req.session.userId}\n`);

  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        let err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
      } else {
        return res.json({
          status: true,
          user: {
            name: user.username,
            email: user.email
          }
        });
      }
    }
  });
});

// GET for logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
});


module.exports = router;