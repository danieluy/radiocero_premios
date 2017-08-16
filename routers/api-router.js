"use strict";
const express = require('express');
const api_router = express.Router();
const bodyParser = require("body-parser");
const db = require('../my_modules/db.js');
const Prizes = require('../my_modules/prizes.js');
const Prize = Prizes.Prize;
const Users = require('../my_modules/users.js');
const User = Users.User;
const Winners = require('../my_modules/winners.js')(db).Winners;
const Winner = require('../my_modules/winners.js')(db).Winner;
const security = require('../my_modules/security.js');
const requireLogin = security.requireLogin;
const checkRoleAdmin = security.checkRoleAdmin;
const headers = require('../my_modules/headers.js');

const prizes_router = require('./prizes-router');
const users_router = require('./users-router');
const winners_router = require('./winners-router');

// Require login
api_router.use(requireLogin);

// Body parser
api_router.use(bodyParser.urlencoded({ extended: true }))

// write CORS headers
api_router.use(headers.writeCORS);

//  Prizes  ////////////////////////////////////////////////////////////////////
api_router.use('/prizes', prizes_router);

//  Users  /////////////////////////////////////////////////////////////////////
api_router.use('/users', users_router);

//  Winners  ///////////////////////////////////////////////////////////////////
api_router.use('/winners', winners_router);

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
