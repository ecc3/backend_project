const { fetchUser } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then(user => {
      if (!user) next({ status: 404, msg: "Username not found" });
      else res.status(200).send(user);
    })
    .catch(err => next(err));
};
