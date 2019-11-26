const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics");
const usersRouter = require("./users");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
