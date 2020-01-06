process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const knex = require("../db/connection");

chai.use(require("chai-sorted"));

after(() => {
  return knex.destroy();
});

before(() => {
  return knex.seed.run();
});

describe("app", () => {
  it("returns status 404 Not Found when using a path that does not exist", () => {
    return request(app)
      .get("/api/tipccs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Path not found");
      });
  });
  describe("405 errors", () => {
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["delete", "patch", "put", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["delete", "patch", "put", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/butter_bridge")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["delete", "patch", "put", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["delete", "post", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/6")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["delete", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/6/comments")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["get", "post", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("returns status 405 when using a method that is not allowed", () => {
      const invalidMethods = ["delete", "post", "patch", "put"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  it("returns status 405 when usig a method that s not allowed", () => {
    const invalidMethods = ["delete", "patch", "put"];
    const methodPromises = invalidMethods.map(method => {
      return request(app)
        [method]("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("method not allowed");
        });
    });
    return Promise.all(methodPromises);
  });
  describe("/api", () => {
    describe("GET", () => {
      it("responds with a JSON object describing all available endpoints on API", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body: { endpoints } }) => {
            expect(endpoints).to.be.a("string");
            const parsedEndpoints = JSON.parse(endpoints);
            const endpointPaths = Object.keys(parsedEndpoints);
            expect(endpointPaths.length).to.equal(10);
          });
      });
    });
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
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an("array");
              expect(topics[0]).to.have.keys(["description", "slug"]);
              expect(topics[0]).to.deep.equal({
                description: "The man, the Mitch, the legend",
                slug: "mitch"
              });
            });
        });
      });
    });
    describe("/users", () => {
      describe("GET", () => {
        it("responds wth status 200", () => {
          return request(app)
            .get("/api/users")
            .expect(200);
        });
        it("responds with an object of users containing an array of all the users with username, name and avatar properties", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
              expect(users).to.be.an("array");
              expect(users[0]).to.have.keys(["username", "name", "avatar_url"]);
              expect(users[0]).to.deep.equal({
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
              });
            });
        });
      });
      describe("POST", () => {
        it("respond with status 201", () => {
          return request(app)
            .post("/api/users")
            .send({
              username: "loyal_gonzola1",
              name: "mandy",
              avatar_url:
                "https://cdn1.thr.com/sites/default/files/imagecache/768x433/2019/03/avatar-publicity_still-h_2019.jpg"
            })
            .expect(201);
        });
        it("adds a new user to the total users", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
              expect(users.length).to.equal(5);
            });
        });
        it("responds with the posted user", () => {
          return request(app)
            .post("/api/users")
            .send({
              username: "loyal_gonzola2",
              name: "mandy",
              avatar_url:
                "https://cdn1.thr.com/sites/default/files/imagecache/768x433/2019/03/avatar-publicity_still-h_2019.jpg"
            })
            .expect(201)
            .then(({ body: { user } }) => {
              expect(user).to.have.keys(["username", "name", "avatar_url"]);
              expect(user.username).to.equal("loyal_gonzola2");
              expect(user.name).to.equal("mandy");
              expect(user.avatar_url).to.equal(
                "https://cdn1.thr.com/sites/default/files/imagecache/768x433/2019/03/avatar-publicity_still-h_2019.jpg"
              );
            });
        });
        it("returns status 400: malformed body when required fields are missing from the sent body", () => {
          return request(app)
            .post("/api/users")
            .send({
              username: "loyal_gonzola3",
              wrong_name: "Lovely. Aboslutely lovely."
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Malformed body: missing required fields");
            });
        });
        it("returns status 400 when sending a body value of the wrong type", () => {
          return request(app)
            .post("/api/users")
            .send({
              username: "loyal_gonzola4",
              name: 57357,
              avatar_url:
                "https://cdn1.thr.com/sites/default/files/imagecache/768x433/2019/03/avatar-publicity_still-h_2019.jpg"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Malformed body: incorrect type");
            });
        });
      });
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
              .then(({ body: { user } }) => {
                expect(user).to.have.keys(["username", "avatar_url", "name"]);
                expect(user).to.deep.equal({
                  username: "icellusedkars",
                  name: "sam",
                  avatar_url:
                    "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                });
              });
          });
          it("returns 404 for username not found", () => {
            return request(app)
              .get("/api/users/wrong_username")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Username not found");
              });
          });
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
            .get("/api/articles?limit=1000000")
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
        it("accepts an order query that can be set to asc", () => {
          return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.ascendingBy("title");
            });
        });
        it("accepts an order query that can be set to desc", () => {
          return request(app)
            .get("/api/articles?sort_by=title&order=desc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("title");
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
        it("returns 400 Bad request for invalid sort_by queries", () => {
          return request(app)
            .get("/api/articles?sort_by=invalid")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
        it("returns 400 Bad request for invalid order queries", () => {
          return request(app)
            .get("/api/articles?order=invalid")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
        it("returns 404 Not found for invalid topic queries", () => {
          return request(app)
            .get("/api/articles?topic=invalid")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found");
            });
        });
        it("returns 404 Not found for invalid author queries", () => {
          return request(app)
            .get("/api/articles?author=invalid")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found");
            });
        });
        it("returns 404 Not found when querying topic and author and one is invalid", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge&topic=invalid")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).equal("Not found");
              console.log(body.articles);
            });
        });
        it('accepts a limit query defaulting to 10, and a "p" query defaulting to 1', () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(10);
              expect(articles[0].title).to.equal(
                "Living in the shadow of a great man"
              );
            });
        });
        it("returns the number of articles set in the limit query", () => {
          return request(app)
            .get("/api/articles?limit=7")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(7);
            });
        });
        it("returns the set of articles for a requested page", () => {
          return request(app)
            .get("/api/articles?p=2")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(2);
              expect(articles[0].title).to.equal("Am I a cat?");
            });
        });
        it("returns a total_count property displaying the total number of articles", () => {
          return request(app)
            .get("/api/articles?limit=3&p=2&topic=mitch")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).to.equal(3);
              expect(body.articles[0].title).to.equal("Student SUES Mitch!");
              expect(body.total_count).to.equal("12");
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
              .then(({ body: { article } }) => {
                expect(article).to.have.keys([
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                ]);
                expect(article).to.deep.equal({
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
              .then(({ body: { article } }) => {
                expect(article.comment_count).to.equal("2");
              });
          });
          it("returns 404 for valid id not found", () => {
            return request(app)
              .get("/api/articles/55")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article not found");
              });
          });
          it("returns 400 for invalid id", () => {
            return request(app)
              .get("/api/articles/bad_id")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
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
              .then(
                ({
                  body: {
                    article: { votes }
                  }
                }) => {
                  expect(votes).to.equal(10);
                }
              );
          });
          it("decrements the number of votes when passed a negative number", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -23 })
              .expect(200)
              .then(
                ({
                  body: {
                    article: { votes }
                  }
                }) => {
                  expect(votes).to.equal(77);
                }
              );
          });
          it("returns the updated article object", () => {
            return request(app)
              .patch("/api/articles/5")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.deep.equal({
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
          it("returns 404 for valid id not found", () => {
            return request(app)
              .patch("/api/articles/55")
              .send({ inc_votes: 10 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article not found");
              });
          });
          it("returns 400 for invalid id", () => {
            return request(app)
              .patch("/api/articles/bad_id")
              .send({ inc_votes: 10 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("returns 400 for invalid value passed in body", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: "ten" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("returns 200 when passed an empty body and increases the votes by 0", () => {
            return request(app)
              .patch("/api/articles/9")
              .send({})
              .expect(200)
              .then(
                ({
                  body: {
                    article: { votes }
                  }
                }) => {
                  expect(votes).to.equal(0);
                }
              );
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
          it("adds new comment to total comments", () => {
            return request(app)
              .get("/api/articles/5/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(3);
              });
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
              .then(({ body: { comment } }) => {
                expect(comment).to.have.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                ]);
                expect(comment.article_id).to.equal(7);
                expect(comment.author).to.equal("butter_bridge");
                expect(comment.votes).to.equal(0);
                expect(comment.body).to.equal(
                  "GUY FIERI, have you eaten at your new restaurant in Times Square? Have you pulled up one of the 500 seats at Guy’s American Kitchen & Bar and ordered a meal? Did you eat the food? Did it live up to your expectations? Did panic grip your soul as you stared into the whirling hypno wheel of the menu, where adjectives and nouns spin in a crazy vortex?"
                );
              });
          });
          it("returns status 400: malformed body when required fields are missing from the sent body", () => {
            return request(app)
              .post("/api/articles/6/comments")
              .send({
                username: "butter_bridge",
                wrong_body: "Lovely. Aboslutely lovely."
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Malformed body: missing required fields");
              });
          });
          it("returns status 400 when sending a body value of the wrong type", () => {
            return request(app)
              .post("/api/articles/7/comments")
              .send({
                username: "butter_bridge",
                body: 17453
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Malformed body: incorrect type");
              });
          });
          it("returns 404 for valid article id not found", () => {
            return request(app)
              .post("/api/articles/505/comments")
              .send({
                username: "butter_bridge",
                body: "You are entering the dream time"
              })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Not found");
              });
          });
          it("returns 400 for invalid id", () => {
            return request(app)
              .post("/api/articles/bad_id/comments")
              .send({
                username: "butter_bridge",
                body: "Less of a man, more of a mouse"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request");
              });
          });
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
          it("returns 404 for valid article ID not found", () => {
            return request(app)
              .get("/api/articles/900/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Article not found");
              });
          });
          it("returns 400 for invalid article ID given", () => {
            return request(app)
              .get("/api/articles/nineninenine/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request");
              });
          });
          it("returns 400 for invalid order queries", () => {
            return request(app)
              .get("/api/articles/1/comments?order=invalid")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request");
              });
          });
          it("returns 400: Bad request for invalid sort_by queries", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=invalid")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request");
              });
          });
          it("returns an array of 0 comments when an article has no comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).to.equal(0);
              });
          });
          it('accepts a limit query defaulting to 10, and a "p" query defaulting to 1', () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(10);
                expect(comments[0].body).to.equal(
                  "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
                );
              });
          });
          it("returns the number of comments set in the limit query", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=7")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(7);
              });
          });
          it("returns the set of articles for a requested page", () => {
            return request(app)
              .get("/api/articles/1/comments?p=2")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(3);
                expect(comments[0].body).to.equal(
                  "Massive intercranial brain haemorrhage"
                );
              });
          });
          it("returns a total_count property displaying the total number of articles", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=3&p=2")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).to.equal(3);
                expect(body.comments[0].body).to.equal(
                  "I hate streaming noses"
                );
                expect(body.total_count).to.equal("13");
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
              .then(({ body: { comment } }) => {
                expect(comment).to.deep.equal({
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
              .then(({ body: { comment } }) => {
                expect(comment).to.deep.equal({
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
          it("returns 404 for valid id not found", () => {
            return request(app)
              .patch("/api/comments/55")
              .send({ inc_votes: 10 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Comment not found");
              });
          });
          it("returns 400 for invalid id", () => {
            return request(app)
              .patch("/api/comments/bad_id")
              .send({ inc_votes: 10 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("returns 400 for invalid value passed in body", () => {
            return request(app)
              .patch("/api/comments/3")
              .send({ inc_votes: "ten" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
          it("returns 200 when passed an empty body and increases the votes by 0", () => {
            return request(app)
              .patch("/api/comments/9")
              .send({})
              .expect(200)
              .then(
                ({
                  body: {
                    comment: { votes }
                  }
                }) => {
                  expect(votes).to.equal(0);
                }
              );
          });
        });
        describe("DELETE", () => {
          it("returns status 204", () => {
            return request(app)
              .delete("/api/comments/8")
              .expect(204);
          });
          it("removes comment from the database", () => {
            return request(app)
              .delete("/api/comments/8")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("comment_id 8 not found");
              });
          });
          it("returns 400 for invalid id", () => {
            return request(app)
              .delete("/api/comments/bad_id")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request");
              });
          });
        });
      });
    });
  });
});
