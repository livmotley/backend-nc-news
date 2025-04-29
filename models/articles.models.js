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

exports.fetchAllArticles = (sort_by, order, topic, limit, p) => {
    const whitelistSortOptions = ["votes", "author", "title", "article_id", "topic", "comment_count", "created_at"];
    const whitelistOrderOptions = ["asc", "desc"];
    let defaultQuery = `
        SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id`
    let queryValues = [];
    let countQuery = `SELECT COUNT(*) AS total_count FROM articles`;
    
    if( sort_by && !whitelistSortOptions.includes(sort_by) || 
    order && !whitelistOrderOptions.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid Query.'})
    }
    
    sort_by = sort_by || 'created_at';
    order = order || 'desc';
    
    if(topic) {
        defaultQuery += ` WHERE articles.topic = $1`;
        countQuery += ` WHERE articles.topic = $1`
        queryValues.push(topic);
    } 
    
    defaultQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
    
    const numLimit = Number(limit);
    const numPage = Number(p);
    let x = 10;
    let y = ((numPage - 1) * x);
    
    if(!limit && !p) {
        defaultQuery += ` LIMIT ${x}`
    } else if(limit && !p) {
        defaultQuery += ` LIMIT ${numLimit}`
    }
    
    if(p && !limit) {
        defaultQuery += ` LIMIT ${x} OFFSET ${y}`
    } else if(p && limit) {
        y = ((numPage - 1) * numLimit);
        defaultQuery += ` LIMIT ${numLimit} OFFSET ${y}`
    }

    return Promise.all([
        db.query(countQuery, queryValues),
        db.query(defaultQuery, queryValues)
    ])
    .then(([count, articleArray]) => {
        return {
            total_count: count.rows[0].total_count,
            articles: articleArray.rows
        }
    })
}

exports.fetchCommentsByArticleId = (article_id, limit, p) => {
    let queryStr = `
    SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
    FROM comments
    LEFT JOIN articles
    ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC`;
    let queryValues = [article_id];
    let totalCommentsQuery = `SELECT COUNT(*) AS total_comments FROM comments`

    limit = Number(limit) || 10;
    let y = ((Number(p) - 1) * limit);

    return db.query(totalCommentsQuery)
    .then(({rows}) => {
        const totalComments = parseInt(rows[0].total_comments, 10);

        if((limit * (Number(p) - 1)) >= totalComments) {
            return Promise.reject({status: 404, msg: 'Page not found.'})
        }
        else {
            if(limit && !p) {
                queryStr += ` LIMIT $2`
                queryValues.push(limit);
            } else if (limit === 10 && p) {
                queryStr += ` LIMIT $2 OFFSET $3`;
                queryValues.push(limit, y);
            } else if(limit && p) {
                queryStr += ` LIMIT $2 OFFSET $3`;
                queryValues.push(limit, y)
            } 
            else if(!limit && !p) {
                queryStr += ` LIMIT $2`;
                queryValues.push(limit);
            }
        }

        return db.query(queryStr, queryValues).then(({rows}) => {
        if(rows.length === 0 ) {
            return Promise.reject({status: 404, msg: 'Article not found.'})
        }

        return {comments: rows, totalComments};
        });
    });
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

exports.addNewArticle = (author, title, body, topic, article_img_url) => {
    if(!body || !author || !title || !topic || !article_img_url ) {
        return Promise.reject({ status: 400, msg: 'Invalid input.'});
    }
    return db.query(`
        INSERT INTO articles
        (author, title, body, topic, article_img_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`, [author, title, body, topic, article_img_url])
        .then(({ rows }) => {
            return rows[0].article_id;
        })
}

exports.removeArticleId = (article_id) => {
    return db.query(`
        DELETE FROM articles
        WHERE article_id = $1
        RETURNING *`, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}