const db = require("../db/connection.js");

exports.fetchAllUsers = () => {
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