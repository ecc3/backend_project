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

exports.createUser = (username, name, avatar_url) => {
  return knex("users")
    .insert({
      username: username,
      name: name,
      avatar_url: avatar_url
    })
    .returning("*");
};
