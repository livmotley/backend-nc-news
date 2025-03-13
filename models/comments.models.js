const db = require("../db/connection.js");

exports.removeCommentById = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1 RETURNING *`, [comment_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Comment not found."})
            }
            return rows;
        })
}

exports.updateCommentVote = (comment_id, inc_votes) => {
    return db.query(`
        UPDATE comments
        SET votes = votes + ($1)
        WHERE comment_id = $2
        RETURNING *`, [inc_votes, comment_id])
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.fetchAllComments = (limit, p, sort_by, order ) => {
    let queryStr = `SELECT * FROM comments`
    let queryValues = [];
    let totalComments = `SELECT COUNT(*) AS total_comments FROM comments`;

    sort_by = sort_by || 'created_at';
    order = order || 'desc';

    queryStr += ` ORDER BY ${sort_by} ${order}`

    limit = Number(limit) || 10;
    let y = ((Number(p) - 1) * limit);

    return db.query(totalComments)
    .then(({rows}) => {
        if((limit * (Number(p) - 1)) > rows[0].total_comments) {
            return Promise.reject({status: 404, msg: 'Page not found.'})
        }
        else {
            if(limit && !p) {
                queryStr += ` LIMIT $1`
                queryValues.push(limit);
            } else if (limit === 10 && p) {
                queryStr += ` LIMIT $1 OFFSET $2`;
                queryValues.push(limit, y);
            } else if(limit && p) {
                queryStr += ` LIMIT $1 OFFSET $2`;
                queryValues.push(limit, y)
            } else if(!limit && !p) {
                queryStr += ` LIMIT $1`;
                queryValues.push(limit);
            }
        }
    }).then(() => {
        return db.query(queryStr, queryValues)
    }).then(({rows}) => {
        if(rows.length === 0 ) {
            return Promise.reject({status: 404, msg: 'No comments.'})
        }
        return rows;
    })

}