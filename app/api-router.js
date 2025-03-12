const apiRouter = require("express").Router();
const { getAllEndpoints } = require('../controllers/api.controllers.js')
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const usersRouter = require("./users-router.js");
const commentsRouter = require("./comments-router.js");

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.get("/", getAllEndpoints);

module.exports = apiRouter;