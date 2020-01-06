const { fetchUser, fetchUsers, createUser } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then(user => {
      if (!user) next({ status: 404, msg: "Username not found" });
      else res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postNewUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  if (!username || !name || !avatar_url) {
    next({
      status: 400,
      msg: "Malformed body: missing required fields"
    });
  } else if (typeof name !== "string" || typeof avatar_url !== "string") {
    next({
      status: 400,
      msg: "Malformed body: incorrect type"
    });
  } else {
    createUser(username, name, avatar_url)
      .then(([user]) => {
        res.status(201).send({ user });
      })
      .catch(next);
  }
};
