const db = require('./db/connection');

return db.query(`SELECT * FROM users`)
.then((users) => {
    console.log("all user data from the table >>>", users.rows);
}).then(() => {
    return db.query(`SELECT * FROM articles WHERE topic = 'coding'`)
}).then((coding) => {
    console.log("all articles about coding >>>", coding.rows);
}).then(() => {
    return db.query(`SELECT * FROM comments WHERE votes < 0`)
}).then((lowVotes) => {
    console.log("all comments with <10 votes >>>", lowVotes.rows);
}).then(() => {
    return db.query(`SELECT slug FROM topics`)
}).then((allTopicsAsSlugs) => {
    console.log("all topics, according to the topics table >>>", allTopicsAsSlugs.rows);
}).then(() => {
    return db.query(`SELECT topic FROM articles GROUP BY topic`)
}).then((allTopicsInArticles) => {
    console.log("all topics, according to the articles table >>>", allTopicsInArticles.rows);
}).then(() => {
    return db.query(`SELECT * FROM articles WHERE author = 'grumpy19' ORDER BY created_at DESC`)
}).then((grumpyUserArticles) => {
    console.log("all articles written by grumpy19 >>>", grumpyUserArticles.rows);
}).then(() => {
    return db.query(`SELECT title FROM articles WHERE author = 'grumpy19'`)
}).then((grumpyUserArticleTitles) => {
    console.log("all article titles by grumpy19 >>>", grumpyUserArticleTitles.rows);
}).then(() => {
    return db.query(`SELECT * FROM comments WHERE votes > 10 ORDER BY votes ASC`)
}).then((highVoteComments) => {
    console.log("all comments with more than 10 votes in ascending order >>>", highVoteComments.rows);
}).catch(() => {
    console.log('error in query')
}).finally(() => {
    db.end();
});