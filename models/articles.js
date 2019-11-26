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
