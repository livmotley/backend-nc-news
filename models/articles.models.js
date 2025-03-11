const db = require('../db/connection.js');

exports.fetchArticleById = (article_id) => {
    return db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article not found.'});
        }
        return rows[0];
    })
}

exports.fetchAllArticles = (sort_by, order, topic) => {
    const whitelistSortOptions = ["votes", "author", "title", "article_id", "topic", "comment_count", "created_at"];
    const whitelistOrderOptions = ["asc", "desc"];

    let defaultQuery = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id`
    let queryValues = [];

    if( sort_by && !whitelistSortOptions.includes(sort_by) || 
    order && !whitelistOrderOptions.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid Query.'})
    }

    sort_by = sort_by || 'created_at';
    order = order || 'desc';

    if(topic) {
        defaultQuery += ` WHERE articles.topic = $1`;
        queryValues.push(topic);
    } 

    defaultQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    return db.query(defaultQuery, queryValues)
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
    if(!body || !author) {
        return Promise.reject({ status: 404, msg: 'Invalid input.'});
    }
    return db.query(`
        SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Article not found.'})
            } else {
                return db.query(`
                    INSERT INTO comments 
                    (article_id, author, body, created_at)
                    VALUES ($1, $2, $3, NOW())
                    RETURNING *`, [article_id, author, body])
            }
        })
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.updateVoteCount = (article_id, newVote) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + ($1)
        WHERE article_id = $2
        RETURNING *`, [newVote, article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Article not found.'})
            }
            return rows[0];
        })
}