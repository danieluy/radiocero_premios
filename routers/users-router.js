"use strict";
const express = require('express');
const users_router = express.Router();
const Users = require('../my_modules/users.js');
const User = Users.User;
const security = require('../my_modules/security.js');
const checkRoleAdmin = security.checkRoleAdmin;

users_router.get('/', checkRoleAdmin, (req, res) => {
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

users_router.patch('/', checkRoleAdmin, (req, res) => {
  Users.findById(req.body.id)
    .then(user => {
      user.setEmail(req.body.email)
      user.setRole(req.body.role)
      return user.update()
    })
    .then(WriteResult => {
      if (WriteResult.ok === 1)
        res.status(200).json({ message: 'The user has been correctly updated' })
      else
        res.status(500).json({ error: 'There was a problem writing to database', details: 'WriteResult.ok != 1' })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: 'There was a problem updating the user', details: err.toString() })
    })
});

users_router.patch('/password', checkRoleAdmin, (req, res) => {
  if (req.body.passwordNew === req.body.passwordMatch)
    Users.findById(req.body.id)
      .then(user => {
        user.setPassword(req.body.passwordNew)
        return user.update()
      })
      .then(WriteResult => {
        if (WriteResult.ok === 1)
          res.status(200).json({ message: 'Password correctly updated' })
        else
          res.status(500).json({ error: 'There was a problem writing to database', details: 'WriteResult.ok != 1' })
      })
      .catch(err => {
        console.error(err)
        res.status(500).json({ error: 'There was a problem updating the password', details: err.toString() })
      })
  else
    res.status(400).json({ error: 'Password mismatch', details: 'Password mismatch' })
});

users_router.delete('/:id', checkRoleAdmin, (req, res) => {
  Users.removeById(req.params.id)
    .then(WriteResult => {
      if (WriteResult.result.n > 0)
        res.status(200).json({ message: 'The user has been correctly deleted' })
      else
        res.status(500).json({ error: 'There was a problem removing a document', details: 'WriteResult.result.n <= 0' })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: 'There was a problem deleting the user', details: err.toString() })
    })
});


module.exports = users_router