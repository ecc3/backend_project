const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");
const { articleData, topicData, commentData } = require("../db/data/test-data");

describe("formatDates", () => {
  it("does not mutate passed list", () => {
    const articleDataCopy = [...articleData];
    formatDates(articleDataCopy);
    expect(articleDataCopy).to.deep.equal(articleData);
  });
  it("returns a new array of objects", () => {
    const result = formatDates(articleData);
    expect(result).to.not.equal(articleData);
    expect(Array.isArray(result)).to.equal(true);
    expect(typeof result[0]).to.equal("object");
  });
  it("returns a date object in the object property of created_at", () => {
    const result = formatDates(articleData);
    expect(result[0].created_at instanceof Date).to.equal(true);
  });
});

describe("makeRefObj", () => {
  it("does not mutate the passed list", () => {
    const topicDataCopy = [...topicData];
    formatDates(topicDataCopy);
    expect(topicDataCopy).to.deep.equal(topicData);
  });
  it("returns a new object", () => {
    const result = makeRefObj(topicData);
    expect(typeof result).to.equal("object");
    expect(result).to.not.equal(topicData);
  });
  it("returns an object with key value pairs equivalent to the id and name values of the passed objects", () => {
    const result = makeRefObj([{ article_id: 1, title: "A" }]);
    expect(result.A).to.equal(1);
  });
});

describe("formatComments", () => {
  const articleRef = {
    "Living in the shadow of a great man": 1,
    "Sony Vaio; or, The Laptop": 2,
    "Eight pug gifs that remind me of mitch": 3,
    "Student SUES Mitch!": 4,
    "UNCOVERED: catspiracy to bring down democracy": 5,
    A: 6,
    Z: 7,
    "Does Mitch predate civilisation?": 8,
    "They're not exactly dogs, are they?": 9,
    "Seven inspirational thought leaders from Manchester UK": 10,
    "Am I a cat?": 11,
    Moustache: 12
  };
  it("does not mutate the passed data", () => {
    const commentDataCopy = [...commentData];
    formatComments(commentDataCopy, articleRef);
    expect(commentDataCopy).to.deep.equal(commentData);
  });
  it("returns a new array of formatted comments", () => {
    const result = formatComments(commentData, articleRef);
    expect(result).to.not.equal(commentData);
    expect(Array.isArray(result)).to.equal(true);
  });
  it("changes the author key to a created_by key and the belongs_to key to article_id, and maintains the other keys", () => {
    const result = formatComments(commentData, articleRef);
    expect(result[0]).to.have.keys([
      "body",
      "author",
      "article_id",
      "votes",
      "created_at"
    ]);
  });
  it("has an article_id property that corresponds to the original title provided", () => {
    const result = formatComments(commentData, articleRef);
    expect(result[1].article_id).to.equal(1);
  });
  it("converts the unix date value stored in the created_at key to a javascript date object", () => {
    const result = formatComments(commentData, articleRef);
    expect(result[0].created_at instanceof Date).to.equal(true);
  });
});
