const { fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, addNewComment, updateVoteCount, addNewArticle } = require('../models/articles.models');
const { checkExists } = require("../db/seeds/utils.js");

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
    const { sort_by, order, topic } = req.query;
    let promises = [fetchAllArticles(sort_by, order, topic)];
    
    if(topic) {
        promises.push(checkExists('topics', 'slug', topic, 'Topic'));
    }

    Promise.all(promises)
    .then(([articles]) => {
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
    const promises = [
        checkExists('users', 'username', username, 'User'),
        addNewComment(article_id, username, body)];
        Promise.all(promises)
        .then(([_, comment]) => {
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

exports.postNewArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body;
    const promises = [
        checkExists('users', 'username', author, 'Author'),
        checkExists('topics', 'slug', topic, 'Topic')
    ]
    Promise.all(promises)
    .then(() => {
        return addNewArticle(author, title, body, topic, article_img_url)
    })
    .then((article_id) => {
        return fetchArticleById(article_id)
    })
    .then((article) => {
        res.status(201).send({ article })
    })
    .catch((err) => {
        next(err);
    })
}