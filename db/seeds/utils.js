const db = require("../../db/connection");

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

module.exports = { createRefObject, convertTimestampToDate };