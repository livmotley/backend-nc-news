const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics.controllers.js");

topicsRouter.get("/", getAllTopics);

module.exports = topicsRouter;