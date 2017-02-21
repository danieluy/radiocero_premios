"use strict";

const db = require('./db.js');

const Prize = function (prize_info) {

  checkInputData(prize_info);

  // Properties
  let id = prize_info.id;
  let type = prize_info.type;
  let sponsor = prize_info.sponsor;
  let description = prize_info.description;
  let stock = parseInt(prize_info.stock);
  let periodic = prize_info.periodic;
  let set_date = prize_info.set_date;
  let update_date = prize_info.update_date;
  let due_date = prize_info.due_date ? new Date(prize_info.due_date).getTime() : null;
  let note = prize_info.note;
  let total_handed = prize_info.total_handed || 0;

  // Methods
  const save = () => {
    if (id)
      throw "ERROR: This prize has already been saved, try using the update method";
    return new Promise((resolve, reject) => {
      db.insert('prizes', {
        'type': type,
        'sponsor': sponsor,
        'description': description,
        'stock': stock,
        'periodic': periodic,
        'set_date': Date.now(),
        'update_date': null,
        'due_date': due_date,
        'note': note,
        'total_handed': total_handed
      })
        .then((WriteResult) => {
          id = WriteResult.ops[0]._id;
          return resolve(WriteResult);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  const update = () => {
    if (!id)
      throw "ERROR: A prize can only be edited after it has been saved";
    return new Promise((resolve, reject) => {
      db.update('prizes', { id: id }, {
        'type': type,
        'sponsor': sponsor,
        'description': description,
        'stock': stock,
        'periodic': periodic,
        'update_date': Date.now(),
        'due_date': due_date,
        'note': note,
        'total_handed': total_handed
      })
        .then((WriteResult) => {
          return resolve(WriteResult);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  const edit = (values) => {
    checkInputData(values);
    type = values.type;
    sponsor = values.sponsor;
    description = values.description;
    stock = values.stock;
    periodic = values.periodic;
    due_date = values.due_date;
    note = values.note;
    total_handed = values.total_handed;
    return update();
  }

  const stockUpdate = (stock_val, handed_val) => {
    let int_stock_val = parseInt(stock_val);
    let int_handed_val = parseInt(handed_val);
    if (!stock_val || isNaN(int_stock_val))
      throw new Error("The stock's modifier stock_val must be a integer");
    if (!handed_val || isNaN(int_handed_val))
      throw new Error("The total_handed modifier handed_val must be a integer");
    if (stock + int_stock_val < 0)
      throw new Error("The stock's modifier stock_val was greater than the current stock");
    if (total_handed + int_handed_val < 0)
      throw new Error("The substraction of the provided value handed_val would result in a negative total_handed value");
    if (stock)
      stock += int_stock_val;
    total_handed -= int_stock_val;
    return update();
  }

  const stockIncrease = (val) => {
    if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0)
      throw new Error("The stock's modifier value must be a integer > 0");
    let modifier = Math.abs(val);
    if (!this.periodic) {
      return stockUpdate(modifier, modifier)
    }
    else
      return stockUpdate(0, modifier)
  }

  const stockDecrease = (val) => {
    if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0)
      throw new Error("The stock's modifier value must be a integer > 0");
    let modifier = Math.abs(val) * -1;
    if (!this.periodic) {
      return stockUpdate(modifier, modifier)
    }
    else
      return stockUpdate(0, modifier)
  }

  const getPublicData = () => {
    return {
      id: id,
      type: type,
      sponsor: sponsor,
      description: description,
      stock: stock,
      periodic: periodic,
      set_date: set_date,
      update_date: update_date,
      due_date: due_date,
      note: note,
      total_handed: total_handed
    }
  }

  return {
    // Public Methods
    save: save,
    edit: edit,
    update: update,
    getPublicData: getPublicData,
    stockIncrease: stockIncrease,
    stockDecrease: stockDecrease,
    getId: () => id,
    getStock: () => stock
  }
}

const checkInputData = (prize_info) => {
  if (!prize_info.type || !prize_info.sponsor || !prize_info.description)
    throw new Error('ERROR: To create a new prize, "type", "sponsor" and "description" parameters must be provided');

  if (prize_info.periodic === null || prize_info.periodic === undefined)
    throw new Error('ERROR: To create a new prize the "periodic: boolean" parameter must be provided');
  else {
    if (prize_info.periodic !== true && prize_info.periodic !== false)
      prize_info.periodic = prize_info.periodic === 'true' ? true : false;
    prize_info.stock = prize_info.periodic === true ? null : parseInt(prize_info.stock);
  }

  if (prize_info.stock && (isNaN(prize_info.stock) || prize_info.stock < 0))
    throw new Error('ERROR: The stock value must be an integer >= 0');

  if (prize_info.due_date && new Date(prize_info.due_date).getTime() === NaN)
    throw new Error('ERROR: Invalid date format for due_date. Required format "yyyy/MM/dd"');
  else if (prize_info.due_date)
    prize_info.due_date = new Date(prize_info.due_date).getTime();

  if (prize_info.update_date && new Date(prize_info.update_date).getTime() === NaN)
    throw new Error('ERROR: Invalid date format for update_date. Required format "yyyy/MM/dd"');
  else if (prize_info.update_date)
    prize_info.update_date = new Date(prize_info.update_date).getTime();

  if (prize_info.set_date && new Date(prize_info.set_date).getTime() === NaN)
    throw new Error('ERROR: Invalid date format for set_date. Required format "yyyy/MM/dd"');
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
            periodic: result.periodic,
            set_date: result.set_date,
            due_date: result.due_date,
            note: result.note,
            total_handed: result.total_handed
          }));
        return resolve(null);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Prizes module - Returned ERROR: ' + err);
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
        return reject('ERR_DB - Unable to fetch prizes data - Prizes module - Returned ERROR: ' + err);
      });
  });
}

module.exports = {
  Prize: Prize,
  findById: findById,
  findAll: findAll
}
