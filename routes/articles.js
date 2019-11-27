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

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment);

articlesRouter.route("/").get(getAllArticles);

module.exports = articlesRouter;
