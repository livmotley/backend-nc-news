const db = require("../db/connection.js");

exports.fetchAllUsers = (sort_by, order, limit, p) => {
    let query = `SELECT * FROM users`;
    let values = [];
    let totalTopics = `SELECT COUNT(*) AS total_users FROM users`;

    sort_by = sort_by || 'username';
    order = order || 'asc';

    query += ` ORDER BY ${sort_by} ${order}`

    limit = Number(limit) || 10;
    let y = ((Number(p) - 1) * limit);

    return db.query(totalTopics)
    .then(({rows}) => {
        if((limit * (Number(p) - 1)) > rows[0].total_topics) {
            return Promise.reject({status: 404, msg: 'Page not found.'})
        }
        else {
            if(limit && !p) {
                query += ` LIMIT $1`
                values.push(limit);
            } else if (limit === 10 && p) {
                query += ` LIMIT $1 OFFSET $2`;
                values.push(limit, y);
            } else if(limit && p) {
                query += ` LIMIT $1 OFFSET $2`;
                values.push(limit, y)
            } else if(!limit && !p) {
                query += ` LIMIT $1`;
                values.push(limit);
            }
        }
    }).then(() => {
        return db.query(query, values)
    }).then(({rows}) => {
        if(rows.length === 0 ) {
            return Promise.reject({status: 404, msg: 'No comments.'})
        }
        return rows;
    })

    return db.query(`
        SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        })
}

exports.fetchSpecificUser = (username) => {
    return db.query(`
        SELECT * FROM users
        WHERE username = $1`, [username])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found'});
            }
            return rows[0];
        })
}

exports.removeUser = (username) => {
    return db.query(`
        DELETE FROM users
        WHERE username = $1
        RETURNING *`, [username])
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.updateUser = (username, name, avatar_url) => {
    let query = `UPDATE users`;
    let values = [];

    if(name && !avatar_url) {
        query += ` SET name = $1 WHERE username = $2`
        values.push(name, username);
    } else if(!name && avatar_url) {
        query += ` SET avatar_url = $1 WHERE username = $2`
        values.push(avatar_url, username);
    } else if(name && avatar_url) {
        query += ` SET avatar_url = $1, name = $2 WHERE username = $3`
        values.push(avatar_url, name, username);
    }

    query += ` RETURNING *`

    return db.query(query, values)
    .then(({ rows }) => {
        return rows[0];
    })
}