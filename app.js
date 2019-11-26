const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/api");

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
