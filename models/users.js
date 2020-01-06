const knex = require("../db/connection");

exports.fetchUser = username => {
  return knex
    .select("*")
    .from("users")
    .where({ username })
    .then(response => {
      return response[0];
    });
};

exports.fetchUsers = () => {
  return knex.select("*").from("users");
};
