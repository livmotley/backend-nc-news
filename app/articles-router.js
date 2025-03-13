const articlesRouter = require("express").Router();
const { getArticleById, getAllArticles, getCommentsByArticleId, postNewComment, patchVoteCount, postNewArticle, deleteArticleId, deleteCommentsByArticleId } = require('../controllers/articles.controllers');

articlesRouter
.route("/")
.get(getAllArticles)
.post(postNewArticle);

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchVoteCount)
.delete(deleteArticleId);

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postNewComment)

module.exports = articlesRouter;