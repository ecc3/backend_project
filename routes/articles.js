const articlesRouter = require("express").Router();
const {
  postNewComment,
  getCommentsByArticleId
} = require("../controllers/comments");
const {
  getArticleById,
  patchArticleById,
  getAllArticles
} = require("../controllers/articles");
const { send405Error } = require("../error-handlers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment)
  .all(send405Error);

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(send405Error);

module.exports = articlesRouter;
