const commentsRouter = require("express").Router();
const { deleteCommentById, patchCommentVote } = require("../controllers/comments.controllers.js");

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentVote);

module.exports = commentsRouter;