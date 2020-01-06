const knex = require("../db/connection");

exports.createNewComment = (article_id, username, body) => {
  return knex("comments")
    .insert({
      author: username,
      article_id: article_id,
      body: body
    })
    .returning("*");
};

exports.fetchCommentsForArticle = (
  article_id,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
) => {
  return knex("comments")
    .where({ article_id })
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit);
};

exports.updateCommentById = (comment_id, inc_votes = 0) => {
  return knex("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};

exports.removeCommentById = comment_id => {
  return knex("comments")
    .where({ comment_id })
    .del();
};
