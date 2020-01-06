const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getAllUsers,
  postNewUser
} = require("../controllers/users");
const { send405Error } = require("../error-handlers");

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(postNewUser)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
