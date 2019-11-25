exports.formatDates = list => {
  return (result = list.map(articleObj => {
    const jsDateObj = new Date(articleObj.created_at);
    articleObj.created_at = jsDateObj;
    return articleObj;
  }));
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
