const db = require('../db/connection.js');

exports.fetchAllTopics = (limit, p, sort_by, order) => {
    let query = `SELECT * FROM topics`;
    let values = [];
    let totalTopics = `SELECT COUNT(*) AS total_topics FROM topics`;

    sort_by = sort_by || 'slug';
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
}

exports.addNewTopic = (slug, description) => {
    if(!slug || !description) {
        return Promise.reject({status: 400, msg: 'Invalid input.'})
    }
    return db.query(`
        INSERT INTO topics
        (slug, description)
        VALUES ($1, $2)
        RETURNING *`, [slug, description])
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.fetchTopicBySlug = (slug) => {
    return db.query(`
        SELECT * FROM topics
        WHERE slug = $1`, [slug])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Topic not found.'})
            }
            return rows[0];
        })
}

exports.removeTopic = (slug) => {
    return db.query(`
        DELETE FROM topics
        WHERE slug = $1
        RETURNING *`, [slug])
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.updateTopic = (slug, description, img_url) => {
    let query = `UPDATE topics`
    let values = []

    if(description && !img_url) {
        query += ` SET description = $1 WHERE slug = $2 RETURNING *`
        values.push(description, slug)
    } else if(!description && img_url) {
        query += ` SET img_url = $1 WHERE slug = $2 RETURNING *`
        values.push(img_url, slug)
    } else if(description && img_url) {
        query += ` SET description = $1, img_url = $2 
        WHERE slug = $3 RETURNING *`;
        values.push(description, img_url, slug);
    }

    return db.query(query, values)
    .then(({ rows }) => {
        return rows[0];
    })
}