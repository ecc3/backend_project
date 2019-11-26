process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const knex = require("../connection");

after(() => {
  return knex.destroy();
});

before(() => {
  return knex.seed.run();
});

describe("app", () => {
  describe("/api", () => {
    describe("/topics", () => {
      describe("GET", () => {
        it("responds with status 200", () => {
          return request(app)
            .get("/api/topics")
            .expect(200);
        });
        it("responds with an object topics containing an array of all the topics with slug and description properties", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.an("array");
              expect(body.topics[0]).to.have.keys(["description", "slug"]);
              expect(body.topics[0]).to.deep.equal({
                description: "The man, the Mitch, the legend",
                slug: "mitch"
              });
            });
        });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        describe("GET", () => {
          it("returns status 200 for getting a user by their username", () => {
            return request(app)
              .get("/api/users/icellusedkars")
              .expect(200);
          });
          it("returns a user object with correct properties", () => {
            return request(app)
              .get("/api/users/icellusedkars")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.have.keys(["username", "avatar_url", "name"]);
                expect(body).to.deep.equal({
                  username: "icellusedkars",
                  name: "sam",
                  avatar_url:
                    "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                });
              });
          });
          //add tests for errors 404 and 405
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
        describe("GET", () => {
          it("returns status 200", () => {
            return request(app)
              .get("/api/articles/2")
              .expect(200);
          });
          it("sends the required article as an object with the correct properties", () => {
            return request(app)
              .get("/api/articles/3")
              .expect(200)
              .then(response => {
                expect(response.body).to.have.keys([
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                ]);
                expect(response.body).to.deep.equal({
                  article_id: 3,
                  title: "Eight pug gifs that remind me of mitch",
                  topic: "mitch",
                  author: "icellusedkars",
                  body: "some gifs",
                  created_at: "2010-11-17T12:21:54.171Z",
                  votes: 0,
                  comment_count: 0
                });
              });
          });
          it("returns the correct comment count for comments associated with the article", () => {
            return request(app)
              .get("/api/articles/5")
              .expect(200)
              .then(({ body }) => {
                expect(body.comment_count).to.equal(2);
              });
          });
        });
        describe("PATCH", () => {
          it("returns status 200", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: 10 })
              .expect(200);
          });
          it("increases the number of votes by the passed number", () => {
            return request(app)
              .patch("/api/articles/4")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body: { votes } }) => {
                expect(votes).to.equal(10);
              });
          });
          it("decrements the number of votes when passed a negative number", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -23 })
              .expect(200)
              .then(({ body: { votes } }) => {
                expect(votes).to.equal(77);
              });
          });
          it("returns the updated article object", () => {
            return request(app)
              .patch("/api/articles/5")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.deep.equal({
                  article_id: 5,
                  title: "UNCOVERED: catspiracy to bring down democracy",
                  topic: "cats",
                  author: "rogersop",
                  body:
                    "Bastet walks amongst us, and the cats are taking arms!",
                  created_at: "2002-11-19T12:21:54.171Z",
                  votes: 10
                });
              });
          });
        });
      });
    });
  });
});
