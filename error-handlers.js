exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.psqlHandle400s = (err, req, res, next) => {
  const psqlErrors = ["22P02"];
  if (psqlErrors.includes(err.code))
    res.status(400).send({ msg: "Bad request" });
  else next(err);
};

exports.psqlHandle404s = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else next(err);
};
