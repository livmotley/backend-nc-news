const express = require("express");
const app = express();
const { getAllEndpoints } = require('../controllers/api.controllers.js')
const { getAllTopics } = require("../controllers/topics.controllers.js");
const { getArticleById, getAllArticles, getCommentsByArticleId } = require('../controllers/articles.controllers')
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("../controllers/errors.controllers");

app.get('/api', getAllEndpoints);

app.get('/api/topics', getAllTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;