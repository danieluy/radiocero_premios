"use strict";
const express = require('express');
const v2_router = express.Router();
const bodyParser = require("body-parser");
const security = require('../my_modules/security');
const headers = require('../my_modules/headers.js');
const path = require('path');

// Body parser
v2_router.use(bodyParser.urlencoded({ extended: false }))

// write CORS headers
v2_router.use(headers.writeCORS);




//  login  /////////////////////////////////////////////////////////////////////
v2_router.post('/login', (req, res) => {
  if (!req.body.userName || !req.body.password)
    res.status(400).json({ error: 'Bad Request', details: "Username and password parameters must be provided" });
  else {
    security.login(req.body.userName, req.body.password)
      .then((user) => {
        if (user) {
          req.session.user = user.userName;
          req.session.role = user.role;
          res.status(200).json({ error: null, user: user });
        }
        else {
          req.session.reset();
          res.status(401).json({ error: 'Wrong user name or password.', user: null });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(503).json({ error: 'There was a problem with the login process, please try again later.', details: err.toString() });
      })
  }
});

//  logout  ////////////////////////////////////////////////////////////////////
v2_router.post('/logout', (req, res) => {
  if (req.session)
    req.session.reset();
  res.status(200).json({ error: null, user: null });
});

//  login status check  /////////////////////////////////////////////////////////
v2_router.post('/logged', (req, res) => {
  if (req.session.user)
    res.status(200).json({
      error: null,
      user: {
        userName: req.session.user,
        role: req.session.role
      }
    });
  else
    res.status(200).json({
      error: null,
      user: null
    });
});

//  static  //////////////////////////////////////////////////////////////////////
v2_router.get('/*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
});


module.exports = v2_router;
