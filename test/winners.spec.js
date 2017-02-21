"use strict";

const db = require('./mocks/db');

const expect = require('chai').expect;
const Winner = require('../my_modules/winners')(db).Winner;
const Winners = require('../my_modules/winners')(db).Winners;

describe('new Winner()', function () {
  it('should instantiate a new Winner', function () {
    const w = new Winner({
      ci: '12345672',
      name: 'Tyler',
      lastname: 'Durden',
      facebook: 'https://www.facebook.com',
      gender: "M",
      phone: '099 099 099',
      mail: 'tyler@tfc.com',
      prizes: [
        { 'id': 'prize_id', 'handed': null, 'granted': Date.now() }
      ]
    });
    expect(Winner.prototype.isPrototypeOf(w)).be.true;
  })
  it('should throw: To create a new Winner, "ci", "name" and "lastname" parameters must be provided', function () {
    expect(() => {
      new Winner({ name: 'Tyler', lastname: 'Durden' })
    }).throw('To create a new Winner, "ci", "name" and "lastname" parameters must be provided');
  })
  it('should throw: To create a new Winner, "ci", "name" and "lastname" parameters must be provided', function () {
    expect(() => {
      new Winner({ ci: '12345672', lastname: 'Durden' })
    }).throw('To create a new Winner, "ci", "name" and "lastname" parameters must be provided');
  })
  it('should throw: To create a new Winner, "ci", "name" and "lastname" parameters must be provided', function () {
    expect(() => {
      new Winner({ ci: '12345672', name: 'Tyler' })
    }).throw('To create a new Winner, "ci", "name" and "lastname" parameters must be provided');
  })
  it('should throw: The provided C.I. number is not valid', function () {
    expect(() => {
      new Winner({
        ci: '12345670',
        name: 'Tyler',
        lastname: 'Durden'
      });
    }).throw('The provided C.I. number is not valid');
  })
  it('should throw: The gender value can only be "F", "M" or "O"', function () {
    expect(() => {
      new Winner({
        ci: '12345672',
        name: 'Tyler',
        lastname: 'Durden',
        gender: 'Female'
      });
    }).throw('The gender value can only be "F", "M" or "O"');
  })
  it('should throw: The mail value must be a valid email address', function () {
    expect(() => {
      new Winner({
        ci: '12345672',
        name: 'Tyler',
        lastname: 'Durden',
        mail: 'tryler@.com'
      });
    }).throw('The mail value must be a valid email address');
  })
})

describe('Winner.hasWonSinceThreeMonths()', function () {
  it('prize granted 0 days ago', function () {
    const w = new Winner({
      ci: '12345672',
      name: 'Tyler',
      lastname: 'Durden',
      prizes: [
        { 'id': 'prize_id', 'handed': null, 'granted': Date.now() }
      ]
    });
    expect(w.hasWonSinceThreeMonths()).be.true;
  })
  it('prize granted 1 day ago', function () {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const w = new Winner({
      ci: '12345672',
      name: 'Tyler',
      lastname: 'Durden',
      prizes: [
        { 'id': 'prize_id', 'handed': null, 'granted': yesterday.getTime() }
      ]
    });
    expect(w.hasWonSinceThreeMonths()).be.true;
  })
  it('prize granted 89 days ago', function () {
    let eighty_nine = new Date();
    eighty_nine.setDate(eighty_nine.getDate() - 89);
    const w = new Winner({
      ci: '12345672',
      name: 'Tyler',
      lastname: 'Durden',
      prizes: [
        { 'id': 'prize_id', 'handed': null, 'granted': eighty_nine.getTime() }
      ]
    });
    expect(w.hasWonSinceThreeMonths()).be.true;
  })
  it('prize granted 90 days ago', function () {
    let ninety = new Date();
    ninety.setDate(ninety.getDate() - 90);
    const w = new Winner({
      ci: '12345672',
      name: 'Tyler',
      lastname: 'Durden',
      prizes: [
        { 'id': 'prize_id', 'handed': null, 'granted': ninety.getTime() }
      ]
    });
    expect(w.hasWonSinceThreeMonths()).be.false;
  })
  it('prize granted now and 90 days ago', function () {
    let ninety = new Date();
    ninety.setDate(ninety.getDate() - 90);
    const w = new Winner({
      ci: '12345672',
      name: 'Tyler',
      lastname: 'Durden',
      prizes: [
        { 'id': 'prize_id', 'handed': null, 'granted': ninety.getTime() },
        { 'id': 'prize_id', 'handed': null, 'granted': Date.now() }
      ]
    });
    expect(w.hasWonSinceThreeMonths()).be.true;
  })
})

