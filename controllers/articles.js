const {
  fetchArticle,
  updateArticle,
  fetchAllArticles
} = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([article]) => {
      if (article) res.status(200).send(article);
      else {
        console.log("no article");
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { author } = req.query;
  const { topic } = req.query;
  fetchAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
