const knex = require("../connection");

exports.fetchArticle = article_id => {
  return knex
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(article => {
      const commentsPromise = knex
        .select("*")
        .from("comments")
        .where({ article_id });
      return Promise.all([commentsPromise, article]);
    })
    .then(([comments, article]) => {
      const numOfComments = comments.length;
      article[0].comment_count = numOfComments;
      return article[0];
    });
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
