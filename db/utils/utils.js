exports.formatDates = list => {
  return (result = list.map(articleObj => {
    return (jsDateObj = new Date(articleObj.created_at));
  }));
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
