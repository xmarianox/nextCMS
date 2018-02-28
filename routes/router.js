const express = require('express');
const router = express.Router();

const User = require('../models/users');


router.post('/login', (req, res) => {
  if (req.body.logemail && req.body.logpassword) {
    // console.log(`Request: { logemail: ${req.body.logemail}, logpassword: ${req.body.logpassword} }`);
    User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
      if (error || !user) {
        let err = new Error('Wrong email or password.');
        err.status = 401;
        return res.json({ status: false, message: err.message });
      } else {
        req.session.userId = user._id;
        res.status = 201;
        return res.json({ status: true, message: 'User logged in.' });
      }
    })
  } else {
    res.status = 400;
    return res.json({ status: false, message: 'Error: All fields required.' });
  }
});


router.post('/create_user', (req, res, next) => {
  if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {

    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    };

    // use schema.create to inser data into db
    User.create(userData, (err, user) => {
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


module.exports = router;