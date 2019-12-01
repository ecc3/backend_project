const knex = require("../db/connection");

exports.fetchTopics = () => {
  return knex.select("*").from("topics");
};

exports.fetchTopic = topic => {
  return knex
    .select("*")
    .from("topics")
    .where({ slug: topic })
    .then(response => {
      return response[0];
    });
};
