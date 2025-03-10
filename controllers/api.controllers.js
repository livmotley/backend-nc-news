const endpoints = require("../endpoints.json");
const { fetchAllTopics } = require('../models/api.models');

exports.getAllEndpoints = (req, res) => {
    res.status(200).send({endpoints});
}

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err);
    })
}