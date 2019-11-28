const {
  fetchArticle,
  updateArticle,
  fetchAllArticles
} = require("../models/articles");
const { fetchTopics } = require("../models/topics");
const { fetchUser } = require("../models/users");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([article]) => {
      if (article) res.status(200).send(article);
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
      if (article) res.status(200).send(article);
      else return Promise.reject({ status: 404, msg: "Article not found" });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  let { order } = req.query;
  const { author } = req.query;
  const { topic } = req.query;
  if (order !== "asc") order = "desc";
  return new Promise(function(resolve, reject) {
    if (author) {
      return fetchUser(author).then(user => {
        if (!user) reject({ status: 400, msg: "Bad author request" });
        else resolve("success");
      });
    } else if (topic) {
      return fetchTopics().then(topics => {
        const topicSlugs = topics.map(topicObj => topicObj.slug);
        if (!topicSlugs.includes(topic)) {
          reject({ status: 400, msg: "Bad topic request" });
        } else resolve("success");
      });
    } else resolve("success");
  })
    .then(successMsg => {
      return fetchAllArticles(sort_by, order, author, topic);
    })

    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
