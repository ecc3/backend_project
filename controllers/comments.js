const {
  createNewComment,
  fetchCommentsForArticle,
  updateCommentById,
  removeCommentById
} = require("../models/comments");

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
  const { order } = req.query;
  fetchCommentsForArticle(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
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
