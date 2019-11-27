exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
