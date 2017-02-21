"use strict";

const Winner = function (db, values) {

  if (!values.ci || !values.name || !values.lastname)
    throw new Error('To create a new Winner, "ci", "name" and "lastname" parameters must be provided');
  if (!checkCi(values.ci))
    throw new Error('The provided C.I. number is not valid');
  if (values.gender && values.gender.toUpperCase() !== 'F' && values.gender.toUpperCase() !== 'M' && values.gender.toUpperCase() !== 'O')
    throw new Error('The gender value can only be "F", "M" or "O"');
  if (values.mail && !values.mail.match(/\S+\@\S+\.\S+/))
    throw new Error('The mail value must be a valid email address');

  this.db = db;
  this.id = values.id;
  this.ci = values.ci;
  this.name = values.name;
  this.lastname = values.lastname;
  this.facebook = values.facebook;
  this.gender = values.gender ? values.gender.toUpperCase() : null;
  this.phone = values.phone;
  this.mail = values.mail;
  this.prizes = values.prizes;
  this.set_date = values.set_date;
  this.update_date = values.update_date;

}

Winner.prototype.save = function () {
  if (this.id)
    throw new Error("This winner has already been saved, try using the update method");
  return new Promise((resolve, reject) => {
    this.db.insert('winners', {
      'ci': this.ci,
      'name': this.name,
      'lastname': this.lastname,
      'facebook': this.facebook,
      'gender': this.gender,
      'phone': this.phone,
      'mail': this.mail,
      'prizes': [],
      'set_date': Date.now(),
      'update_date': null
    })
      .then((WriteResult) => {
        this.id = WriteResult.ops[0]._id;
        return resolve(WriteResult);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

Winner.prototype.update = function () {
  if (!this.id)
    throw new Error("A winner can only be edited after it has been saved");
  return new Promise((resolve, reject) => {
    this.db.update('winners', { id: this.id }, {
      'name': this.name,
      'lastname': this.lastname,
      'facebook': this.facebook,
      'gender': this.gender ? this.gender.toUpperCase() : null,
      'phone': this.phone,
      'mail': this.mail,
      'prizes': this.prizes,
      'update_date': Date.now()
    })
      .then((WriteResult) => {
        return resolve(WriteResult);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}


Winner.prototype.addPrize = function (prize_id) {
  if (!prize_id)
    throw new Error('ERROR: To add a prize the "prize_id" parameter must be provided');
  this.prizes.push({ 'id': prize_id, 'handed': null, 'granted': Date.now() });
  return this.update();
}

Winner.prototype.deletePrize = function (prize_id) {
  if (!prize_id)
    throw new Error('ERROR: To delete a prize the "prize_id" parameter must be provided');
  this.prizes = this.prizes.filter(prize => prize.id !== prize_id);
  return this.update();
}

Winner.prototype.handOverPrize = function (prize_id) {
  let found = false;
  let i = 0;
  while (i < this.prizes.length && !found) {
    if (this.prizes[i].id === prize_id && !this.prizes[i].handed) {
      this.prizes[i].handed = Date.now();
      found = true;
    }
    i++;
  }
  return this.update();
}

Winner.prototype.getPublicData = function () {
  return {
    id: this.id,
    ci: this.ci,
    name: this.name,
    lastname: this.lastname,
    facebook: this.facebook,
    gender: this.gender,
    phone: this.phone,
    mail: this.mail,
    prizes: this.prizes,
    set_date: this.set_date,
    update_date: this.update_date
  }
}

Winner.prototype.hasWonSinceThreeMonths = function () {
  let today = Date.now();
  for (let i = 0; i < this.prizes.length; i++) {
    let difference_days = Math.floor((today - this.prizes[i].granted) / 1000 / 60 / 60 / 24);
    if (difference_days < 90)
      return true;
  }
  return false;
}


const findByCi = (db, ci) => {
  const Winner = winnerBinder(db).Winner;
  return new Promise(function (resolve, reject) {
    db.findOne('winners', { ci: ci })
      .then((result) => {
        if (result) {
          return resolve(new Winner({
            'id': result._id,
            'ci': result.ci,
            'name': result.name,
            'lastname': result.lastname,
            'facebook': result.facebook,
            'gender': result.gender,
            'phone': result.phone,
            'mail': result.mail,
            'prizes': result.prizes,
            'set_date': result.set_date,
            'update_date': result.update_date
          }));
        }
        return resolve(null);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Winners module - Returned ERROR: ' + err);
      });
  });
}

const findAll = (db) => {
  const Winner = winnerBinder(db).Winner;
  return new Promise(function (resolve, reject) {
    db.find('winners')
      .then((results) => {
        if (results.length) {
          return resolve(results.map(result =>
            new Winner({
              'id': result._id,
              'ci': result.ci,
              'name': result.name,
              'lastname': result.lastname,
              'facebook': result.facebook,
              'gender': result.gender,
              'phone': result.phone,
              'mail': result.mail,
              'prizes': result.prizes,
              'set_date': result.set_date,
              'update_date': result.update_date
            })
          ));
        }
        return resolve([]);
      })
      .catch((err) => {
        console.error(err.stack);
        return reject(err);
      });
  });
}

const checkCi = (ci) => {
  if (ci.match(/^\d+$/) && ci.length >= 7 && ci.length <= 8) {
    let fixed_ci = ci;
    if (ci.length === 7)
      fixed_ci = '0' + ci;
    let coeffs = [2, 9, 8, 7, 6, 3, 4];
    let sum = 0;
    for (let i = 0; i < coeffs.length; i++) {
      let digit = parseInt(fixed_ci.slice(i, i + 1));
      let coeff = coeffs[i];
      let multiply = ((digit * coeff).toString());
      let toAdd = multiply.slice(multiply.length - 1);
      sum += parseInt(toAdd);
    }
    let verifDig = 10 - (sum % 10);
    if (verifDig === 10)
      verifDig = 0;
    if (verifDig.toString() == fixed_ci.slice(fixed_ci.length - 1))
      return true;
  }
  return false;
};

const winnerBinder = function (db) {
  if (!db)
    throw new Error('Parameter mismatch, db parameter must be provided');
  return {
    Winner: Winner.bind(null, db),
    Winners: {
      findByCi: findByCi.bind(null, db),
      findAll: findAll.bind(null, db)
    }
  }
}

module.exports = winnerBinder;