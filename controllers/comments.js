const {
  createNewComment,
  fetchCommentsForArticle,
  updateCommentById
} = require("../models/comments");

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;
  createNewComment(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send(comment);
    })
    .catch(err => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;
  fetchCommentsForArticle(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes).then(([comment]) => {
    res.status(200).send(comment);
  });
};
