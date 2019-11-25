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
  it("returns a date object", () => {
    const result = formatDates(articleData);
    expect(result[0] instanceof Date).to.equal(true);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
