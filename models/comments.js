const knex = require("../connection");

exports.createNewComment = (article_id, username, body) => {
  return knex("comments").insert(
    {
      author: username,
      article_id: article_id,
      body: body
    },
    ["*"]
  );
};

exports.fetchCommentsForArticle = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return knex("comments")
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return knex("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};
