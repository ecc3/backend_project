const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");
const { articleData, topicData } = require("../db/data/test-data");

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

describe("formatComments", () => {});
