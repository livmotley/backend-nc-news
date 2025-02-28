const db = require("../connection");
const format = require("pg-format");
const { createRefObject, convertTimestampToDate } = require('./utils');

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(() => {
    return db.query('DROP TABLE IF EXISTS articles')
  }).then(() => {
    return db.query('DROP TABLE IF EXISTS users')
  }).then(() => {
    return db.query('DROP TABLE IF EXISTS topics')
  }).then(() => {
    return createTopics();
  }).then(() => {
    return createUsers();
  }).then(() => {
    return createArticles();
  }).then(() => {
    return createComments();
  }).then(() => {
    return insertTopics(topicData);
  }).then(() => {
    return insertUsers(userData);
  }).then((userInfo) => {
    const authorNames = userInfo.rows;
    const authorLookup = createRefObject(authorNames, "username", "username");

      return db.query(`SELECT * FROM topics`)
      .then((topicInfo) => {
        const topicNames = topicInfo.rows;
        const topicLookup = createRefObject(topicNames, "slug", "slug");
        const formattedArticles = articleData.map((article) => {
          const { created_at } = convertTimestampToDate(article);
          return [
            article.title, 
            topicLookup[article.topic], 
            authorLookup[article.author],
            article.body,
            created_at,
            article.votes,
            article.article_img_url 
          ];
        });
        const sqlArticles = format(
          `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
          VALUES %L RETURNING *`, formattedArticles
        );
        return db.query(sqlArticles);
      });
  }).then((articleInfo) => {
    const articleTitle = articleInfo.rows;
    const articleLookup = createRefObject(articleTitle, "title", "article_id")

    return db.query(`SELECT * FROM users`)
    .then((userInfo) => {
      const userCatelogue = userInfo.rows;
      const userLookup = createRefObject(userCatelogue, "username", "author");
      const formattedComments = commentData.map((comment) => {
        const { created_at } = convertTimestampToDate(comment);
        return [
          articleLookup[comment.article_id],
          comment.body,
          comment.votes,
          userLookup[comment.author],
          created_at
        ]
      })
      const sqlComments = format(`
        INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES %L`, formattedComments
      );
        return db.query(sqlComments);
    })
  })
};

module.exports = seed;

function createTopics() {
  return db.query(`CREATE TABLE topics(
    slug VARCHAR(100) PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    img_url VARCHAR(1000) NOT NULL
  )`);
}

function createUsers() {
  return db.query(`CREATE TABLE users(
    username VARCHAR(40) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL
    )`);
}

function createArticles() {
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    topic VARCHAR(100) REFERENCES topics(slug),
    author VARCHAR(40) REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL
    )`);
}

function createComments() {
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(40) REFERENCES users(username),
    created_at TIMESTAMP
    )`);
}

function insertTopics(x) {
  const formattedTopics = x.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  });
  const sqlTopics = format(
    `INSERT INTO topics (slug, description, img_url)
    VALUES %L RETURNING *`, formattedTopics
  );
  return db.query(sqlTopics);
}

function insertUsers(y) {
  const formattedUsers = y.map((user) => {
    return [user.username, user.name, user.avatar_url]
  });
  const sqlUsers = format(
    `INSERT INTO users (username, name, avatar_url)
    VALUES %L RETURNING *`, formattedUsers
  );
  return db.query(sqlUsers);
}

// function insertArticles(z, a, {topicData}) {
//   const authorNames = z.rows;
//   const authorLookup = createRefObject(authorNames, "username", "username");

//   const topicNames = insertTopics(topicData).rows;
//   const topicLookup = createRefObject(topicNames, "slug", "slug");

//   const formattedArticles = a.map((article) => {
//     return [
//       article.title, 
//       topicLookup[article.topic], 
//       authorLookup[article.author],
//       article.body,
//       article.created_at,
//       article.votes,
//       article.article_img_url 
//     ];
//   });

//   const sqlArticles = format(
//     `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
//     VALUES %L RETURNING *`, formattedArticles
//   );
//   return db.query(sqlArticles);
// }