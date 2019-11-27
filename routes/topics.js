const express = require("express");
const topicsRouter = express.Router();
const { getAllTopics } = require("../controllers/topics");
const { send405Error } = require("../error-handlers");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(send405Error);

module.exports = topicsRouter;
