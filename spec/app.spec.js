process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const knex = require("../connection");

chai.use(require("chai-sorted"));

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
      describe("GET", () => {
        it("responds with status 200", () => {
          return request(app)
            .get("/api/articles")
            .expect(200);
        });
        it("responds with an array of articles, with the correct properties", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(12);
              expect(articles[0]).to.have.keys([
                "title",
                "author",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ]);
              expect(articles[11]).to.deep.equal({
                article_id: 12,
                title: "Moustache",
                topic: "mitch",
                author: "butter_bridge",
                created_at: "1974-11-26T12:21:54.171Z",
                votes: 0,
                comment_count: "0"
              });
            });
        });
        it("accepts a sort_by query that defaults to created_at and an order query that defaults to desc", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("created_at");
            });
        });
        it("accepts a sort_by query that sorts the articles by any valid column", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("title");
            });
        });
        it("accepts an order query that can be set to asc or desc", () => {
          return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.ascendingBy("title");
            });
        });
        it("accepts an author query that filters the articles by the username specified in the query", () => {
          return request(app)
            .get("/api/articles?author=icellusedkars")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].author).to.equal("icellusedkars");
            });
        });
        it("accepts a topic query that filters the articles by the topic value specified in the query", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].topic).to.equal("mitch");
            });
        });
        it("includes a comment_count property in each object that correctly sums the number of comments for each article", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].comment_count).to.equal("13");
            });
        });
      });
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
                  comment_count: "0"
                });
              });
          });
          it("returns the correct comment count for comments associated with the article", () => {
            return request(app)
              .get("/api/articles/5")
              .expect(200)
              .then(({ body }) => {
                expect(body.comment_count).to.equal("2");
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
      describe("/comments", () => {
        describe("POST", () => {
          it("responds with status 201", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({
                username: "butter_bridge",
                body: "GUY FIERI bad bad bad"
              })
              .expect(201);
          });
          it("responds with the posted comment", () => {
            return request(app)
              .post("/api/articles/7/comments")
              .send({
                username: "butter_bridge",
                body:
                  "GUY FIERI, have you eaten at your new restaurant in Times Square? Have you pulled up one of the 500 seats at Guy’s American Kitchen & Bar and ordered a meal? Did you eat the food? Did it live up to your expectations? Did panic grip your soul as you stared into the whirling hypno wheel of the menu, where adjectives and nouns spin in a crazy vortex?"
              })
              .expect(201)
              .then(({ body }) => {
                expect(body).to.have.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                ]);
                expect(body.article_id).to.equal(7);
                expect(body.author).to.equal("butter_bridge");
                expect(body.votes).to.equal(0);
                expect(body.body).to.equal(
                  "GUY FIERI, have you eaten at your new restaurant in Times Square? Have you pulled up one of the 500 seats at Guy’s American Kitchen & Bar and ordered a meal? Did you eat the food? Did it live up to your expectations? Did panic grip your soul as you stared into the whirling hypno wheel of the menu, where adjectives and nouns spin in a crazy vortex?"
                );
              });
          });
          //check new comment has been added to total??
        });
        describe("GET", () => {
          it("returns a status of 200", () => {
            return request(app)
              .get("/api/articles/9/comments")
              .expect(200);
          });
          it("returns an array of comments for the given article with the correct keys", () => {
            return request(app)
              .get("/api/articles/9/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).to.equal(2);
                expect(body.comments[0]).to.have.keys([
                  "comment_id",
                  "article_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                ]);
                expect(body.comments[0].article_id).to.equal(9);
                expect(body.comments[1].article_id).to.equal(9);
              });
          });
          it("accepts a sort_by query that defaults to created_at and order query that defaults to desc", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("created_at");
              });
          });
          it("accepts a sort_by query that sorts by a number field", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("votes");
              });
          });
          it("accepts a sort_by query that sorts by a string field", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.descendingBy("author");
              });
          });
          it("accepts an order query that can be set to asc or desc", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.ascendingBy("author");
              });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("returns status 200", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 10 })
              .expect(200);
          });
          it("returns the updated comment with the votes updated", () => {
            return request(app)
              .patch("/api/comments/3")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.deep.equal({
                  comment_id: 3,
                  article_id: 1,
                  body:
                    "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                  author: "icellusedkars",
                  votes: 110,
                  created_at: "2015-11-23T12:36:03.389Z"
                });
              });
          });
          it("returns the updated comment with points removed if passed a negative number", () => {
            return request(app)
              .patch("/api/comments/4")
              .send({ inc_votes: -50 })
              .expect(200)
              .then(({ body }) => {
                expect(body).to.deep.equal({
                  comment_id: 4,
                  article_id: 1,
                  body:
                    " I carry a log — yes. Is it funny to you? It is not to me.",
                  author: "icellusedkars",
                  votes: -150,
                  created_at: "2014-11-23T12:36:03.389Z"
                });
              });
          });
        });
      });
    });
  });
});
