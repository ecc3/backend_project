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
        });
      });
    });
  });
});
