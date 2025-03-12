const articlesRouter = require("express").Router();
const { getArticleById, getAllArticles, getCommentsByArticleId, postNewComment, patchVoteCount } = require('../controllers/articles.controllers');

articlesRouter.get("/", getAllArticles);

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchVoteCount);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postNewComment);

module.exports = articlesRouter;