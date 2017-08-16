"use strict";
const express = require('express');
const winners_router = express.Router();
const db = require('../my_modules/db.js');
const Prizes = require('../my_modules/prizes.js');
const Prize = Prizes.Prize;
const Winners = require('../my_modules/winners.js')(db).Winners;
const Winner = require('../my_modules/winners.js')(db).Winner;

winners_router.get('/', (req, res) => {
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

winners_router.get('/unhandedprizes', (req, res) => {
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

winners_router.post('/findci', (req, res) => {
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

winners_router.post('/handprize', (req, res) => {
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

winners_router.post('/cancelHandprize', (req, res) => {
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

winners_router.post('/checkwinner', (req, res) => { //  NEED TO GUARANTEE THAT THE CI IS VALID  //////////////////////////////////////////////////////////////////////////////////////
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

module.exports = winners_router