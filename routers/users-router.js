"use strict";
const express = require('express');
const users_router = express.Router();
const Users = require('../my_modules/users.js');
const User = Users.User;
const security = require('../my_modules/security.js');
const checkRoleAdmin = security.checkRoleAdmin;

users_router.get('/', (req, res) => {
  Users.findAll()
    .then((results) => {
      if (results) {
        res.status(200).json(results.map((result) => result.getPublicData()));
      }
      else
        res.status(200).json([]);
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a problem fetching the winner's data", details: err.toString() });
    })
});

users_router.post('/', checkRoleAdmin, (req, res) => {
  var u = new User({
    userName: req.body.name,
    password: req.body.password,
    role: req.body.role,
    email: req.body.email
  })
    .save()
    .then((WriteResult) => {
      if (WriteResult.insertedCount > 0) {
        res.status(200).json({ message: 'The user has been correctly saved' });
      }
      else
        res.status(500).json({ error: "There was a problem creating the user", details: err.toString() });
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a problem creating the user", details: err.toString() });
    })
});

module.exports = users_router