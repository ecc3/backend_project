const express = require("express");
const { customErrors, psqlHandle400s } = require("./error-handlers");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/api");

app.use("/api", apiRouter);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(customErrors);
app.use(psqlHandle400s);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
