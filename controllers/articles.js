const {
  fetchArticle,
  updateArticle,
  fetchAllArticles
} = require("../models/articles");
const { fetchTopic } = require("../models/topics");
const { fetchUser } = require("../models/users");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([article]) => {
      if (article) res.status(200).send({ article });
      else {
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
      if (article) res.status(200).send({ article });
      else return Promise.reject({ status: 404, msg: "Article not found" });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;

  if (order && order !== ("asc" || "desc")) {
    return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
  }

  const promises = [fetchAllArticles(sort_by, order, author, topic, limit, p)];
  if (author) promises.push(fetchUser(author));
  if (topic) promises.push(fetchTopic(topic));

  return Promise.all(promises)
    .then(([articles, ...responses]) => {
      if ((author || topic) && responses.includes(undefined)) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(next);
};
