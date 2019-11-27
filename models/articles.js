const knex = require("../connection");

exports.fetchArticle = article_id => {
  return knex
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where({ "articles.article_id": article_id })
    .count("comment_id as comment_count")
    .groupBy("articles.article_id");
};

exports.updateArticle = (article_id, inc_votes) => {
  return knex
    .select("votes")
    .from("articles")
    .where({ article_id })
    .returning("votes")
    .then(response => {
      return knex("articles")
        .where({ article_id })
        .update(
          {
            votes: response[0].votes + inc_votes
          },
          ["*"]
        );
    })
    .then(response => {
      return response[0];
    });
};

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return knex
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(sort_by, order)
    .count("comment_id as comment_count")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ topic });
    });
};
