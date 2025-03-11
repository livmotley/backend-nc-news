const { fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, addNewComment, updateVoteCount } = require('../models/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getAllArticles = (req, res, next) => {
    const { sort_by, order } = req.query;
    fetchAllArticles(sort_by, order)
    .then((articles) => {
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err);
    })
}

exports.postNewComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    addNewComment(article_id, username, body)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchVoteCount = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateVoteCount(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
    })
}