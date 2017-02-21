"use strict";

const db = require('./db.js');

/*
prize_info = {
  type :srting,
  sponsor :srting,
  description :srting,
  periodic :boolean
  [, stock :integer]
  [, id :srting]
  [, set_date :integer]
  [, update_date :integer]
  [, due_date :integer]
  [, note :srting]
  [, total_handed :integer]
}
*/

const Prize = function (prize_info) {

  this.checkInputData(prize_info);

  this.id = prize_info.id;
  this.type = prize_info.type;
  this.sponsor = prize_info.sponsor;
  this.description = prize_info.description;
  this.stock = prize_info.stock;
  this.periodic = prize_info.periodic;
  this.set_date = prize_info.set_date;
  this.update_date = prize_info.update_date;
  this.due_date = prize_info.due_date;
  this.note = prize_info.note;
  this.total_handed = prize_info.total_handed || 0;

  this.callToken = Math.random();

}
Prize.prototype.save = function () {
  if (this.id)
    throw "ERROR: This prize has already been saved, try using the update method";
  return new Promise((resolve, reject) => {
    db.insert('prizes', {
      'type': this.type,
      'sponsor': this.sponsor,
      'description': this.description,
      'stock': this.stock,
      'periodic': this.periodic,
      'set_date': Date.now(),
      'update_date': null,
      'due_date': this.due_date,
      'note': this.note,
      'total_handed': this.total_handed
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
Prize.prototype.update = function () {
  if (!this.id)
    throw "ERROR: A prize can only be edited after it has been saved";
  return new Promise((resolve, reject) => {
    db.update('prizes', { id: this.id }, {
      'type': this.type,
      'sponsor': this.sponsor,
      'description': this.description,
      'stock': this.stock,
      'periodic': this.periodic,
      'update_date': Date.now(),
      'due_date': this.due_date,
      'note': this.note,
      'total_handed': this.total_handed
    })
      .then((WriteResult) => {
        return resolve(WriteResult);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}
Prize.prototype.edit = function (values) {
  this.checkInputData(values);
  this.type = values.type;
  this.sponsor = values.sponsor;
  this.description = values.description;
  this.stock = values.stock;
  this.periodic = values.periodic;
  this.due_date = values.due_date;
  this.note = values.note;
  this.total_handed = values.total_handed || 0;
  return this.update();
}
Prize.prototype.stockIncrease = function (val) {
  if (!val || isNaN(parseInt(val)) || parseInt(val) < 0)
    throw new Error("The stock's modifier value must be a integer >= 0");
  let modifier = Math.abs(parseInt(val));
  if (!this.periodic)
    return this.stockUpdate(this.callToken, modifier, modifier);
  else
    return this.stockUpdate(this.callToken, null, modifier)
}
Prize.prototype.stockDecrease = function (val) {
  if (!val || isNaN(parseInt(val)) || parseInt(val) < 0)
    throw new Error("The stock's modifier value must be a integer >= 0");
  let modifier = Math.abs(parseInt(val)) * -1;
  if (!this.periodic)
    return this.stockUpdate(this.callToken, modifier, modifier);
  else
    return this.stockUpdate(this.callToken, null, modifier)
}
Prize.prototype.stockUpdate = function (token, stock_val, handed_val) {
  if (token === this.callToken) {
    if (!stock_val) {
      this.total_handed -= handed_val;
    }
    else {
      this.stock += stock_val;
      this.total_handed -= handed_val;
    }
    return this.update();
  }
  else
    return Promise.reject(new Error('Please use Prize.stockIncrease(val: number) or Prize.stockDecrease(val: number)'))
}
Prize.prototype.getPublicData = function () {
  return {
    id: this.id,
    type: this.type,
    sponsor: this.sponsor,
    description: this.description,
    stock: this.stock,
    periodic: this.periodic,
    set_date: this.set_date,
    update_date: this.update_date,
    due_date: this.due_date,
    note: this.note,
    total_handed: this.total_handed
  }
}
Prize.prototype.checkInputData = function (prize_info) {

  if (!prize_info.type || !prize_info.sponsor || !prize_info.description)
    throw new Error('To create a new prize, "type", "sponsor" and "description" parameters must be provided');

  if (prize_info.periodic === null || prize_info.periodic === undefined)
    throw new Error('To create a new prize the "periodic: boolean" parameter must be provided');
  else {
    if (prize_info.periodic !== true && prize_info.periodic !== false)
      prize_info.periodic = prize_info.periodic === 'true' ? true : false;
    prize_info.stock = prize_info.periodic === true ? null : parseInt(prize_info.stock);
  }

  if (prize_info.stock && (isNaN(prize_info.stock) || prize_info.stock < 0))
    throw new Error('The stock value must be an integer >= 0');

  if(prize_info.total_handed && (isNaN(parseInt(prize_info.total_handed)) || prize_info.stock < 0))
    throw new Error('The total_handed value must be an integer >= 0')

  if (prize_info.due_date && new Date(prize_info.due_date).getTime() === NaN)
    throw new Error('Invalid date format for due_date. Required format "yyyy/MM/dd"');
  else if (prize_info.due_date)
    prize_info.due_date = new Date(prize_info.due_date).getTime();

  if (prize_info.update_date && new Date(prize_info.update_date).getTime() === NaN)
    throw new Error('Invalid date format for update_date. Required format "yyyy/MM/dd"');
  else if (prize_info.update_date)
    prize_info.update_date = new Date(prize_info.update_date).getTime();

  if (prize_info.set_date && new Date(prize_info.set_date).getTime() === NaN)
    throw new Error('Invalid date format for set_date. Required format "yyyy/MM/dd"');
  else if (prize_info.set_date)
    prize_info.set_date = new Date(prize_info.set_date).getTime();

}





const findById = (id) => {
  if (!id)
    throw "The parameter id must be provided";
  return new Promise((resolve, reject) => {
    db.findById('prizes', id)
      .then((result) => {
        if (result)
          return resolve(new Prize({
            id: result._id,
            type: result.type,
            sponsor: result.sponsor,
            description: result.description,
            stock: result.stock,
            periodic: result.periodic || 'false',
            set_date: result.set_date,
            due_date: result.due_date,
            note: result.note,
            total_handed: result.total_handed || 0
          }));
        return resolve(null);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Prizes module - findById() - Returned ERROR: ' + err);
      });
  });
}
const findAll = () => {
  return new Promise(function (resolve, reject) {
    db.find('prizes')
      .then((results) => {
        if (results.length) {
          return resolve(results.map((result) => {
            return new Prize({
              id: result._id,
              type: result.type,
              sponsor: result.sponsor,
              description: result.description,
              stock: parseInt(result.stock),
              periodic: result.periodic || false,
              set_date: result.set_date,
              update_date: result.update_date,
              due_date: result.due_date,
              note: result.note,
              total_handed: result.total_handed
            });
          }));
        }
        return resolve([]);
      })
      .catch((err) => {
        console.error(err.stack ? err.stack : err);
        return reject(err.stack ? err.stack : err);
      });
  });
}
module.exports = {
  Prize: Prize,
  findById: findById,
  findAll: findAll
}
