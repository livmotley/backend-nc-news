const topicsRouter = require("express").Router();
const { getAllTopics, postNewTopic, getTopicBySlug, deleteTopic, patchTopic } = require("../controllers/topics.controllers.js");

topicsRouter
.route("/")
.get(getAllTopics)
.post(postNewTopic);

topicsRouter
.route("/:slug")
.get(getTopicBySlug)
.delete(deleteTopic)
.patch(patchTopic)

module.exports = topicsRouter;