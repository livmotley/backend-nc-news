const db = require("../../db/connection");
const format = require("pg-format");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

function createRefObject(array, key1, key2) {
  const refObject = {};
  array.forEach((object) => {
    refObject[object[key1]] = object[key2];
  })
  return refObject;
}

function checkExists(table, column, value, item) {
  const queryStr = format(`
    SELECT * FROM %I 
    WHERE %I = $1`, table, column);
    return db.query(queryStr, [value])
    .then(({ rows }) => {
      if(rows.length === 0) {
        return Promise.reject({ status: 404, msg: `${item} not found.`})
      }
    })
}

function checkDataType(data) {
  const regex = /^\d+$/;
  const check = regex.test(data);
  if(!check) {
    return Promise.reject({status: 400, msg: 'Invalid input.'})
  }
}

function checkForDuplicates(table, column, value, item) {
  const queryStr = format(`
    SELECT * FROM %I
    WHERE %I = $1`, table, column);
    return db.query(queryStr, [value])
    .then(({ rows }) => {
      if(rows.length > 0) {
        return Promise.reject({status: 400, msg: `${item} already exists.`})
      }
    })
}

module.exports = { createRefObject, convertTimestampToDate, checkExists, checkDataType, checkForDuplicates };