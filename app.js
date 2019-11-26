const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/api");

app.use("/api", apiRouter);

module.exports = app;
