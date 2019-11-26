const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const knex = require("../connection");

after(() => {
  return knex.destroy();
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
                description: "Code is love, code is life",
                slug: "coding"
              });
            });
        });
      });
    });
  });
});
