const express = require("express");
const app = express();
const { getAllEndpoints, getAllTopics } = require("../controllers/api.controllers");
const { handleServerErrors } = require("../controllers/errors.controllers");

app.get('/api', getAllEndpoints);

app.get('/api/topics', getAllTopics);

app.use(handleServerErrors);

module.exports = app;