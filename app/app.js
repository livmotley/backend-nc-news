const express = require("express");
const app = express();
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("../controllers/errors.controllers");
const apiRouter = require("./api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Path not found.'});
})

module.exports = app;