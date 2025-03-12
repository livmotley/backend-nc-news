const { removeCommentById, updateCommentVote } = require("../models/comments.models.js");
const { checkExists } = require("../db/seeds/utils.js");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchCommentVote = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const promises = [
        checkExists('comments', 'comment_id', comment_id, 'Comment'),
        updateCommentVote(comment_id, inc_votes)
    ]
    Promise.all(promises)
    .then(([_, comment]) => {
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err);
    })
    
}