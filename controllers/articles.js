const { fetchArticle, updateArticle } = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => next(err));
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => next(err));
};
