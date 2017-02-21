"use strict";

const ObjectID = require('mongodb').ObjectID;

/*
* Params String: collection, Object: values
* Returns Object: WriteResult
*/
const insert = (collection, values) => {
  if (!collection || !values)
    throw "Collection and Values parameters must be provided";
  return new Promise((resolve, reject) => {
    return resolve();
  });
}
/*
* Params String: collection [, Object: query {key: value}]
* Returns Object[]: [Object: document, ...]
*/
const find = (collection, query) => {
  if (!collection)
    throw "Collection parameter must be provided";
  return new Promise(function (resolve, reject) {
    return resolve();
  });
}
/*
* Params String: collection [, Object: query {key: value}]
* Returns Object: document
*/
const findOne = (collection, query) => {
  if (!collection || !query)
    throw "Collection and query parameters must be provided";
  return new Promise(function (resolve, reject) {
    return resolve();
  });
}
/*
* Params String: collection [, Object: query {key: value}]
* Returns Json: document
*/
const findById = (collection, id) => {
  if (!collection || !id)
    throw "Collection and id parameters must be provided";
  return new Promise(function (resolve, reject) {
    return resolve();
  });
}
/*
* Params String: collection, Object: query {key: value}
* Returns Boolean
*/
const exists = (collection, query) => {
  if (!collection || !query)
    throw "Collection and Query parameters must be provided";
  return new Promise(function (resolve, reject) {
    return resolve();
  });
}
/*
* Params (String: collection, Object: update {query: {key: value}, values: {key: value [, ...]}})
* Returns Object: WriteResult
*/
const update = (collection, query, update) => {
  if (!collection || !query || !update)
    throw "Collection, query and update parameters must be provided";
  return new Promise(function (resolve, reject) {
    return resolve();
  });
}

module.exports = {
  insert: insert,
  update: update,
  find: find,
  findOne: findOne,
  findById: findById,
  exists: exists
}
