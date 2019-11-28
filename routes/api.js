const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const { getEndpointsDescription } = require("../controllers/api");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", getEndpointsDescription);

module.exports = apiRouter;
