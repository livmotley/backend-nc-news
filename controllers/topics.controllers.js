const { fetchAllTopics, addNewTopic } = require('../models/topics.models');
const { checkForDuplicates } = require("../db/seeds/utils.js");

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err);
    })
}

exports.postNewTopic = (req, res, next) => {
    const { slug, description } = req.body;
    const promises = [
        checkForDuplicates('topics', 'slug', slug, 'Topic')];
    Promise.all(promises)
    .then(() => {
        return addNewTopic(slug, description)
    })
    .then((topic) => {
        res.status(201).send({topic})
    })
    .catch((err) => {
        next(err);
    })
}