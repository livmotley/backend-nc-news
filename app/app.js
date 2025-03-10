const express = require("express");
const app = express();
const { getAllEndpoints } = require("../controllers/api.controllers");


app.get('/api', getAllEndpoints);

module.exports = app;