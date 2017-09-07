"use strict";
const express = require('express');
const prizes_router = express.Router();
const Prizes = require('../my_modules/prizes.js');
const Prize = Prizes.Prize;
const security = require('../my_modules/security.js');
const checkRoleAdmin = security.checkRoleAdmin;

prizes_router.get('/', (req, res) => {
  Prizes.findAll()
    .then((prizes) => {
      if (prizes)
        res.status(200).json(prizes
          .map(prize => prize.getPublicData())
          .filter(prize => !prize.delete_date)
        );
      else
        res.status(200).json([]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "There was a problem fetching the prizes data", details: err });
    })
});

prizes_router.post('/', (req, res) => {
  console.log(req.body)
  let p = new Prize({
    type: req.body.type,
    sponsor: req.body.sponsor,
    description: req.body.description,
    stock: req.body.stock,
    periodic: req.body.periodic,
    due_date: req.body.due_date,
    note: req.body.note,
    total_handed: req.body.total_handed
  })
    .save()
    .then((WriteResult) => {
      if (WriteResult.insertedCount > 0) {
        res.status(200).json({ message: 'The prize has been correctly saved' });
      }
      else
        res.status(500).json({ error: "There was a problem creating the prize", details: null });
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a problem creating the prize", details: err.toString() });
    })
});

prizes_router.post('/edit', checkRoleAdmin, (req, res) => {
  Prizes.findById(req.body.id)
    .then(prize => {
      if (prize) {
        prize.edit({
          type: req.body.type,
          sponsor: req.body.sponsor,
          description: req.body.description,
          stock: req.body.stock,
          periodic: req.body.periodic,
          due_date: req.body.due_date,
          note: req.body.note,
          total_handed: req.body.total_handed
        })
          .then(WriteResult => {
            if (WriteResult.nModified > 0)
              res.status(200).json({ message: 'The prize has been correctly updated' });
            else
              res.status(500).json({ error: "There was a problem updating the prize", details: 'WriteResult.nModified < 0' });
          })
          .catch(err => {
            console.error(err.stack ? err.stack : err)
            res.status(500).json({ error: "There was a problem updating the prize", details: (err.stack ? err.stack : err) });
          })
      }
      else {
        console.error("The prize does not exist");
        res.status(500).json({ error: "The prize does not exist", details: null });
      }
    })
});

prizes_router.patch('/', checkRoleAdmin, (req, res) => {
  Prizes.findById(req.body.id)
    .then(prize => {
      if (prize) {
        prize.edit({
          type: req.body.type,
          sponsor: req.body.sponsor,
          description: req.body.description,
          stock: req.body.stock,
          periodic: req.body.periodic,
          due_date: req.body.due_date,
          note: req.body.note,
          total_handed: req.body.total_handed
        })
          .then(WriteResult => {
            if (WriteResult.nModified > 0)
              res.status(200).json({ message: 'The prize has been correctly updated' });
            else
              res.status(500).json({ error: "There was a problem updating the prize", details: 'WriteResult.nModified < 0' });
          })
          .catch(err => {
            console.error(err.stack ? err.stack : err)
            res.status(500).json({ error: "There was a problem updating the prize", details: (err.stack ? err.stack : err) });
          })
      }
      else {
        console.error("The prize does not exist");
        res.status(500).json({ error: "The prize does not exist", details: null });
      }
    })
});

prizes_router.delete('/:id', checkRoleAdmin, (req, res) => {
  Prizes.deleteById(req.params.id)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  // .then(WriteResult => {
  //   if (WriteResult.result.n > 0)
  //     res.status(200).json({ message: 'The prize has been correctly deleted' })
  //   else
  //     res.status(500).json({ error: 'There was a problem removing a document', details: 'WriteResult.result.n <= 0' })
  // })
  // .catch(err => {
  //   console.error(err)
  //   res.status(500).json({ error: 'There was a problem deleting the prize', details: err.toString() })
  // })
});

module.exports = prizes_router