const {
  createNewComment,
  fetchCommentsForArticle,
  updateCommentById,
  removeCommentById
} = require("../models/comments");
const { fetchArticle } = require("../models/articles");

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;
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
        res.status(201).send(comment);
      })
      .catch(next);
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  let { order } = req.query;
  if (order !== "asc") order = "desc";
  Promise.all([
    fetchCommentsForArticle(article_id, sort_by, order),
    fetchArticle(article_id)
  ])
    .then(([comments, article]) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else if (!comments[0]) {
        res.status(200).send({ msg: "No comments" });
      } else res.status(200).send({ comments });
    })

    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(([comment]) => {
      if (comment) res.status(200).send(comment);
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
    .catch(err => {
      next(err);
    });
};
