const {
  createNewComment,
  fetchCommentsForArticle,
  updateCommentById,
  removeCommentById
} = require("../models/comments");
const { fetchArticle } = require("../models/articles");

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!body || !username) {
    next({
      status: 400,
      msg: "Malformed body: missing required fields"
    });
  } else if (typeof body !== "string") {
    next({
      status: 400,
      msg: "Malformed body: incorrect type"
    });
  } else {
    createNewComment(article_id, username, body)
      .then(([comment]) => {
        res.status(201).send({ comment });
      })
      .catch(next);
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, limit, p } = req.query;

  if (order && order !== ("asc" || "desc")) {
    return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
  }
  Promise.all([
    fetchCommentsForArticle(article_id, sort_by, order, limit, p),
    fetchArticle(article_id)
  ])
    .then(([comments, [article]]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        res.status(200).send({ comments, total_count: article.comment_count });
      }
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(([comment]) => {
      if (comment) res.status(200).send({ comment });
      else return Promise.reject({ status: 404, msg: "Comment not found" });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(rowsRemoved => {
      if (rowsRemoved === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment_id ${comment_id} not found`
        });
      } else res.sendStatus(204);
    })
    .catch(next);
};
