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