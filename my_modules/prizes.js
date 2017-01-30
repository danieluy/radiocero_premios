"use strict";

const db = require('./db.js');

const Prize = function (prize_info) {

  if (!prize_info.type || !prize_info.sponsor || !prize_info.description)
    throw 'ERROR: To create a new prize, "type", "sponsor" and "description" parameters must be provided';
  if ((isNaN(parseInt(prize_info.stock)) || parseInt(prize_info.stock) < 0) && prize_info.periodic === false)
    throw 'ERROR: The stock value must be an integer >= 0';
  if (prize_info.due_date && new Date(prize_info.due_date).getTime() === NaN)
    throw 'ERROR: Invalid date format for due date. Required format "yyyy/MM/dd"';

  // Properties
  this.id = prize_info.id;
  this.type = prize_info.type;
  this.sponsor = prize_info.sponsor;
  this.description = prize_info.description;
  this.stock = parseInt(prize_info.stock);
  this.periodic = prize_info.periodic;
  this.set_date = prize_info.set_date;
  this.update_date = prize_info.update_date;
  this.due_date = prize_info.due_date ? new Date(prize_info.due_date).getTime() : null;
  this.note = prize_info.note;
  this.total_handed = prize_info.total_handed || 0;

  // Methods
  this.save = () => {
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

  this.update = () => {
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

  this.edit = (values) => {
    if (values.type)
      this.type = values.type;
    if (values.sponsor)
      this.sponsor = values.sponsor;
    if (values.description)
      this.description = values.description;
    if (values.stock)
      this.stock = values.stock;
    if (values.periodic)
      this.periodic = values.periodic;
    if (values.due_date)
      this.due_date = values.due_date;
    if (values.note)
      this.note = values.note;
    if (values.total_handed)
      this.total_handed = values.total_handed;
    return this.update();
  }

  this.stockUpdate = (value) => {
    let intVal = parseInt(value);
    if (!value || isNaN(intVal))
      throw "ERROR: The stock's modifier value must be a integer - Prizes.js module stockUpdate()";
    if (this.stock + intVal < 0)
      throw "ERROR: The stock's modifier value was greater than the current stock - Prizes.js module stockUpdate()";
    this.stock += intVal;
    this.total_handed -= intVal;
    return this.update();
  }

  this.stockIncrease = (val) => {
    if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0)
      throw "ERROR: The stock's modifier value must be a integer > 0 - Prizes.js module stockIncrease()";
    return this.stockUpdate(Math.abs(val))
  }

  this.stockDecrease = (val) => {
    if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0)
      throw "ERROR: The stock's modifier value must be a integer > 0 - Prizes.js module stockDecrease()";
    return this.stockUpdate(Math.abs(val) * -1)
  }

  this.getPublicData = () => {
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

  return {
    // Public Methods
    save: this.save,
    edit: this.edit,
    update: this.update,
    getPublicData: this.getPublicData,
    stockIncrease: this.stockIncrease,
    stockDecrease: this.stockDecrease,
    getId: () => this.id,
    getStock: () => this.stock
  }
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
            periodic: result.periodic,
            set_date: result.set_date,
            due_date: result.due_date,
            note: result.note,
            total_handed: result.total_handed
          }));
        return resolve(null);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
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
              periodic: result.periodic,
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
        return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
      });
  });
}

module.exports = {
  Prize: Prize,
  findById: findById,
  findAll: findAll
}
