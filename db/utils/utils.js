exports.formatDates = list => {
  return (result = list.map(articleObj => {
    const jsDateObj = new Date(articleObj.created_at);
    articleObj.created_at = jsDateObj;
    return articleObj;
  }));
};

exports.makeRefObj = list => {
  const keys = Object.keys(list[0]);
  const titleKey = keys[1];
  const idKey = keys[0];
  return list.reduce((acc, val) => {
    acc[val[titleKey]] = val[idKey];
    return acc;
  }, {});
};

exports.formatComments = (comments, articleRef) => {};
