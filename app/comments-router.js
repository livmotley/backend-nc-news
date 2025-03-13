const commentsRouter = require("express").Router();
const { deleteCommentById, patchCommentVote, getAllComments } = require("../controllers/comments.controllers.js");

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentVote);

commentsRouter
.route("/")
.get(getAllComments);

module.exports = commentsRouter;