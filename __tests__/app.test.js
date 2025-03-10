const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app/app.js");
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');

beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topics with keys of description, slug and img_url", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      const topics = body.topics
      expect(topics).toHaveLength(3);
      expect(Array.isArray(topics)).toBe(true);
      topics.forEach((topic) => {
        expect(typeof topic.description).toBe('string');
        expect(typeof topic.slug).toBe('string');
        expect(typeof topic.img_url).toBe('string');
      })
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an object containing the values for the following keys: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then(({ body }) => {
      const article = body.article;
      expect(typeof article.author).toBe('string');
      expect(typeof article.title).toBe('string');
      expect(article.article_id).toBe(3);
      expect(typeof article.body).toBe('string');
      expect(typeof article.topic).toBe('string');
      expect(typeof article.created_at).toBe('string');
      expect(typeof article.votes).toBe('number');
      expect(typeof article.article_img_url).toBe('string');
    })
  })
  test("404: responds with an error message if the article_id does not exist on the database", () => {
    return request(app)
    .get('/api/articles/500')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Article not found.');
    })
  })
  test("400: responds with an error message if the article_id is not valid", () => {
    return request(app)
    .get('/api/articles/ten')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid input.');
    })
  })
})

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects sorted by date in descending order, each containing the values for the following keys: author, title, article_id, topic, created_at, votes, article_img_url and comment_count", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
      const articles = body.articles;
      expect(articles.length).toBe(13);
      expect(articles).toBeSortedBy('created_at', {descending: true});
      articles.forEach((article) => {
        expect(typeof article.author).toBe('string');
        expect(typeof article.title).toBe('string');
        expect(typeof article.article_id).toBe('number');
        expect(typeof article.topic).toBe('string');
        expect(typeof article.created_at).toBe('string');
        expect(typeof article.votes).toBe('number');
        expect(typeof article.article_img_url).toBe('string');
        expect(typeof article.comment_count).toBe('string');
      })
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id, sorted by date made in descending order. Each comment should have the following properties: comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
      const comments = body.comments;
      expect(comments.length).toBe(11);
      expect(comments).toBeSortedBy('created_at', {descending: true});
      comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe('number');
        expect(typeof comment.votes).toBe('number');
        expect(typeof comment.created_at).toBe('string');
        expect(typeof comment.author).toBe('string');
        expect(typeof comment.body).toBe('string');
        expect(comment.article_id).toBe(1);
      })
    })
  })
  test("404: responds with an error message when the article_id does not exist", () => {
    return request(app)
    .get('/api/articles/100/comments')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Article not found.');
    })
  })
  test("400: responds with an error message when the article_id is invalid", () => {
    return request(app)
    .get('/api/articles/ten/comments')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid input.');
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a comment object that has been added to a specific article as indicated by the article_id", () => {
    return request(app)
    .post('/api/articles/1/comments')
    .send({
      username: "butter_bridge",
      body: "Great article!"
    })
    .expect(201)
    .then(({ body }) => {
      const comment = body.comment;
      expect(comment.article_id).toBe(1);
      expect(comment.author).toBe('butter_bridge');
      expect(comment.body).toBe("Great article!");
      expect(typeof comment.votes).toBe('number');
      expect(typeof comment.created_at).toBe('string');
      expect(typeof comment.comment_id).toBe('number');
    })
  })
  test("404: responds with an error message when the article id doesn't exist", () => {
    return request(app)
    .post('/api/articles/245/comments')
    .send({
      username: "butter_bridge",
      body: "Great article!"
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Article not found.');
    })
  })
  test("400: responds with an error message when the article id is invalid", () => {
    return request(app)
    .post('/api/articles/two/comments')
    .send({
      username: "butter_bridge",
      body: "Great article!"
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid input.');
    })
  })
})