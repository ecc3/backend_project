const express = require("express");
const {
  customErrors,
  psqlHandle400s,
  psqlHandle404s
} = require("./error-handlers");
const apiRouter = require("./routes/api");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(customErrors);
app.use(psqlHandle400s);
app.use(psqlHandle404s);
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
