const { fetchAllTopics, addNewTopic, fetchTopicBySlug, removeTopic } = require('../models/topics.models');
const { checkExists, checkForDuplicates } = require("../db/seeds/utils.js");

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

exports.getTopicBySlug = (req, res, next) => {
    const { slug } = req.params;
    fetchTopicBySlug(slug)
    .then((topic) => {
        res.status(200).send({topic})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteTopic = (req, res, next) => {
    const { slug } = req.params;
    checkExists('topics','slug', slug, 'Topic')
    .then(() => {
        return removeTopic(slug)
    })
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    })
}