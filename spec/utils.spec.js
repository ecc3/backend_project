const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");
const { articleData } = require("../db/data/test-data");

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

describe("makeRefObj", () => {});

describe("formatComments", () => {});
