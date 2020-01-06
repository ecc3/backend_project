const usersRouter = require("express").Router();
const { getUserByUsername, getAllUsers } = require("../controllers/users");
const { send405Error } = require("../error-handlers");

usersRouter
  .route("/")
  .get(getAllUsers)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
