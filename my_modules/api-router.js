"use strict";
const express = require('express');
const api_router = express.Router();
const bodyParser = require("body-parser");
const db = require('./db.js');
const Prizes = require('./prizes.js');
const Prize = Prizes.Prize;
const Users = require('./users.js');
const User = Users.User;
const Winners = require('./winners.js')(db).Winners;
const Winner = require('./winners.js')(db).Winner;
const security = require('./security.js');
const requireLogin = security.requireLogin;
const checkRoleAdmin = security.checkRoleAdmin;
const headers = require('./headers.js');

// Require login
api_router.use(requireLogin);

// Body parser
api_router.use(bodyParser.urlencoded({ extended: true }))

// write CORS headers
api_router.use(headers.writeCORS);

//  Prizes  ////////////////////////////////////////////////////////////////////

api_router.get('/prizes', (req, res) => {
  Prizes.findAll()
    .then((prizes) => {
      if (prizes)
        res.status(200).json(prizes.map(prize =>  prize.getPublicData() ));
      else
        res.status(200).json([]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "There was a problem fetching the prizes data", details: err });
    })
});

api_router.post('/prizes', (req, res) => {
  let p = new Prize({
    type: req.body.type,
    sponsor: req.body.sponsor,
    description: req.body.description,
    stock: req.body.stock,
    periodic: req.body.periodic,
    due_date: req.body.due_date,
    note: req.body.note,
    total_handed: req.body.total_handed
  }).save()
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

api_router.post('/prizes/edit', checkRoleAdmin, (req, res) => {
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

//  Users  /////////////////////////////////////////////////////////////////////

api_router.get('/users', (req, res) => {
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

api_router.post('/users', checkRoleAdmin, (req, res) => {
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

//  Winners  ///////////////////////////////////////////////////////////////////

api_router.get('/winners', (req, res) => {
  Winners.findAll()
    .then((results) => {
      if (results)
        res.status(200).json(results.map((result) => result.getPublicData()));
      else
        res.status(200).json([]);
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a problem fetching the winner's data", details: err.toString() });
    })
});

api_router.get('/winners/unhandedprizes', (req, res) => {
  Winners.findAll()
    .then((results) => {
      if (results) {
        let formatted_results = results.map((result) => result.getPublicData());
        let filtered_results = formatted_results.filter((result) => {
          for (var i = 0; i < result.prizes.length; i++)
            if (!result.prizes[i].handed) return true;
          return false;
        });
        res.status(200).json(filtered_results);
      }
      else
        res.status(200).json([]);
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a problem fetching the winner's data", details: err.toString() });
    })
});

api_router.post('/winners/findci', (req, res) => {
  let ci = req.body.ci;
  Winners.findByCi(ci)
    .then((winner) => {
      if (winner) {
        res.status(200).json({
          winner: {
            ci: winner.ci,
            name: winner.name,
            lastname: winner.lastname,
            facebook: winner.facebook,
            gender: winner.gender,
            phone: winner.phone,
            mail: winner.mail,
            prizes: winner.prizes
          }
        })
      }
      else {
        res.status(200).json({ winner: null })
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a problem fetching the winner", details: err.toString() });
    })
});

api_router.post('/winners/handprize', (req, res) => {
  let winner_ci = req.body.winner_ci;
  let prize_id = req.body.prize_id;
  if (winner_ci && prize_id) {
    Prizes.findById(prize_id)
      .then(prize => {
        if (prize) {
          Winners.findByCi(winner_ci)
            .then((winner) => {
              if (winner) {
                winner.handOverPrize(prize_id)
                  .then(WriteResult => {
                    if (WriteResult.nModified > 0) {
                      res.status(200).json({ message: "The prize was correctly handed over" });
                    }
                    else
                      res.status(500).json({ error: "There was a problem handing over the prize", details: "ERROR [ api-router.js ][ post(/winners/handprize) ][ winner.handOverPrize(" + prize_id + ") ]" });
                  })
                  .catch(err => {
                    console.error(500).json({ error: "There was a problem handing over the prize", details: err.stack });
                  })
              }
              else
                res.status(500).json({ error: "The winner could not be found", details: "ERROR [ api-router.js ][ post(/winners/handprize) ][ Winners.findByCi(" + winner_ci + ") ]" });
            })
        }
        else
          res.status(500).json({ error: "The prize could not be found", details: "ERROR [ api-router.js ][ post(/winners/handprize) ][ Prizes.findById(" + prize_id + ") ]" });
      })
      .catch((err) => {
        console.error(err.stack ? err.stack : err);
        res.status(500).json({ error: "There was a problem handing over the prize", details: (err.stack ? err.stack : err) });
      })
  }
  else
    res.status(400).json({ error: "Bad request, a winner's ci and prize id must be provided", details: "ERROR [ api-router.js ][ post(/winners/handprize) ]" });
});

api_router.post('/winners/cancelHandprize', (req, res) => {
  let winner_ci = req.body.winner_ci;
  let prize_id = req.body.prize_id;
  if (winner_ci && prize_id) {
    Promise.all([
      Prizes.findById(prize_id),
      Winners.findByCi(winner_ci)
    ])
      .then(res_array => {
        const prize = res_array[0];
        const winner = res_array[1];
        if (prize) {
          if (winner) {
            const original_prize_stock = prize.stock;
            const original_winner_prizes = winner.prizes;
            Promise.all([
              prize.stockIncrease(1),
              winner.deletePrize(prize_id)
            ])
              .then(writeResults_array => {
                const WriteResult_prize = writeResults_array[0];
                const WriteResult_winner = writeResults_array[1];
                if (WriteResult_prize.nModified > 0 && WriteResult_winner.nModified > 0)
                  res.status(200).json({ message: "The prize was correctly returned" });
                else {
                  prize.stock = original_prize_stock;
                  winner.prizes = original_winner_prizes;
                  Promise.all([
                    prize.update(),
                    winner.update()
                  ])
                    .then(writeResults_array => {
                      const WriteResult_prize = writeResults_array[0];
                      const WriteResult_winner = writeResults_array[1];
                      if (WriteResult_prize.nModified > 0 && WriteResult_winner.nModified > 0)
                        res.status(500).json({ message: "There was a problem returning the prize and no changes have been made" });
                      else
                        res.status(500).json({ message: `There was a problem returning the prize and some data may be corrupted. The original prize stock value was ${original_prize_stock}, please check that it remains to be` });
                    })
                    .catch()
                  res.status(500).json({ error: "There was a problem returning the prize", details: "ERROR [ api-router.js ][ post(/winners/cancelHandprize) ][ winner.deletePrize(" + prize_id + ") ]" });
                }
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({ error: "There was a problem returning the prize", details: err.toString() });
              })
          }
          else
            res.status(500).json({ error: "The winner could not be found", details: "ERROR [ api-router.js ][ post(/winners/cancelHandprize) ][ Winners.findByCi(" + winner_ci + ") ]" });
        }
        else
          res.status(500).json({ error: "The prize could not be found", details: "ERROR [ api-router.js ][ post(/winners/cancelHandprize) ][ Prizes.findById(" + prize_id + ") ]" });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "There was a problem returning the prize", details: err.toString() });
      })
  }
  else {
    res.status(400).json({ error: "Bad request, a winner's ci and prize id must be provided", details: "ERROR [ api-router.js ][ post(/winners/cancelHandprize) ]" });
  }
});

api_router.post('/winners/checkwinner', (req, res) => { //  NEED TO GUARANTEE THAT THE CI IS VALID  //////////////////////////////////////////////////////////////////////////////////////
  Winners.findByCi(req.body.ci)
    .then((winner) => {
      if (winner && winner.hasWonSinceThreeMonths())
        res.status(200).json({ allowed: false, message: `This person has won in the last three months`, winner: null });
      else if (winner && !winner.hasWonSinceThreeMonths())
        res.status(200).json({ allowed: true, message: `This person is allowed to participate but has already won`, winner: winner.getPublicData() });
      else
        res.status(200).json({ allowed: true, message: `This person is allowed to participate`, winner: null });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "There was a problem checking the winner", details: err.toString() });
    })
})

api_router.post('/grantprize', (req, res) => {
  Winners.findByCi(req.body.ci)
    .then((winner) => {
      //  EXISTING WINNER  //
      if (winner) {
        if (!winner.hasWonSinceThreeMonths()) {
          Prizes.findById(req.body.prize_id)
            .then((prize) => {
              if (prize) {
                if (prize.periodic || prize.stock > 0) {
                  prize.stockDecrease(1)
                    .then((WriteResult) => {
                      if (WriteResult.nModified > 0) {
                        winner.addPrize(req.body.prize_id)
                          .then((WriteResult) => {
                            if (WriteResult.nModified > 0)
                              res.status(200).json({ message: 'The prize has been correctly assigned' });
                            else
                              res.status(500).json({ error: "There was a problem assigning the prize", details: "ERROR [ api-router.js ][ post(/grantprize) ][ existing winner ][ winner.addPrize(" + req.body.prize_id + ") ]" });
                          })
                          .catch(err => console.error(err))
                      }
                      else
                        res.status(500).json({ error: "There was a problem decreasing the prize's stock", details: "ERROR [ api-router.js ][ post(/grantprize) ][ existing winner ][ stockDecrease(1) ]" });
                    })
                }
                else
                  res.status(500).json({ error: "There is not enough stock", details: "ERROR [ api-router.js ][ post(/grantprize) ][ existing winner ][ prize.stock <= 0 ]" });
              }
              else
                res.status(500).json({ error: "There prize couldn't be found", details: "ERROR [ api-router.js ][ post(/grantprize) ][ existing winner ][ Prizes.findById(" + req.body.prize_id + ") ]" });
            })
            .catch(err => console.error(err))
        }
        else
          res.status(500).json({ error: "This person has won in the last three months", details: "ERROR [ api-router.js ][ post(/grantprize) ][ existing winner ][ !winner.hasWonSinceThreeMonths() ]" });
      }
      else {
        //  !EXISTING WINNER  //
        let winner = new Winner({
          ci: req.body.ci,
          name: req.body.name,
          lastname: req.body.lastname,
          facebook: req.body.facebook,
          gender: req.body.gender,
          phone: req.body.phone,
          mail: req.body.mail
        })
        winner.save()
          .then((WriteResult) => {
            if (WriteResult.insertedCount > 0) {
              Prizes.findById(req.body.prize_id)
                .then((prize) => {
                  if (prize) {
                    if (prize.periodic || prize.stock > 0) {
                      prize.stockDecrease(1)
                        .then(WriteResult => {
                          if (WriteResult.nModified > 0) {
                            Winners.findByCi(req.body.ci)
                              .then(winner => {
                                winner.addPrize(req.body.prize_id)
                                  .then((WriteResult) => {
                                    if (WriteResult.nModified > 0)
                                      res.status(200).json({ message: 'The prize has been correctly assigned' });
                                    else
                                      res.status(500).json({ error: "There was a problem assigning the prize, WriteResult.nModified < 0", details: "ERROR [ api-router.js ][ post(/winners) ][ !existing winner ][ winner.addPrize(" + req.body.prize_id + ") ]" });
                                  })
                                  .catch(err => {
                                    console.error(err.stack ? err.stack : err);
                                    res.status(500).json({ error: "There was a problem assigning the prize", details: (err.stack ? err.stack : err) });
                                  })
                              })
                              .catch(err => {
                                console.error(err.stack ? err.stack : err);
                                res.status(500).json({ error: "There was a problem finding the winner", details: (err.stack ? err.stack : err) });
                              })
                          }
                          else
                            res.status(500).json({ error: "There was a problem decreasing the prize's stock", details: "ERROR [ api-router.js ][ post(/winners) ][ !existing winner ][ stockDecrease(1) ]" });
                        })
                        .catch(err => {
                          console.error(err.stack ? err.stack : err);
                          res.status(500).json({ error: "There was a problem decreasing the prize's stock", details: (err.stack ? err.stack : err) });
                        })
                    }
                    else
                      res.status(500).json({ error: "There is not enough stock", details: "ERROR [ api-router.js ][ post(/winners) ][ !existing winner ][ prize.stock <= 0 ]" });
                  }
                  else
                    res.status(500).json({ error: "There prize couldn't be found", details: "ERROR [ api-router.js ][ post(/winners) ][ !existing winner ][ Prizes.findById(" + req.body.prize_id + ") ]" });
                })
            }
            else
              res.status(500).json({ error: "There was a problem saving a new winner", details: "ERROR [ api-router.js ][ post(/winners) ][ !existing winner ][ winner.save() ]" });
          })
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "There was a problem asigning the prize", details: err.toString() });
    })
});

module.exports = api_router;
