const { fetchTopics } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({ topics });
  });
};
