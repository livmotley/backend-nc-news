const topicsRouter = require("express").Router();
const { getAllTopics, postNewTopic, getTopicBySlug, deleteTopic } = require("../controllers/topics.controllers.js");

topicsRouter
.route("/")
.get(getAllTopics)
.post(postNewTopic);

topicsRouter
.route("/:slug")
.get(getTopicBySlug)
.delete(deleteTopic)

module.exports = topicsRouter;