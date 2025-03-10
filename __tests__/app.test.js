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