const endpoints = require("../endpoints.json");
const {  } = require('../models/api.models');

exports.getAllEndpoints = (req, res) => {
    res.status(200).send({endpoints});
}