const fs = require("fs");

exports.getEndpointsDescription = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf8", (err, JSONDescription) => {
    if (err) next(err);
    else res.status(200).send({ endpoints: JSON.parse(JSONDescription) });
  });
};
