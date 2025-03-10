const db = require('../db/connection.js');

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article not found.'});
        }
        return rows[0];
    })
}

exports.fetchAllArticles = () => {
    return db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
        FROM comments
        LEFT JOIN articles
        ON articles.article_id = comments.article_id
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found.'})
        }
        return rows;
    })
}

exports.addNewComment = (article_id, author, body) => {
    return db.query(`
        SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Article not found.'})
            }
            return db.query(`
                INSERT INTO comments 
                (article_id, author, body, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING *`, [article_id, author, body])
        })
        .then(({ rows }) => {
            return rows[0];
        })
}