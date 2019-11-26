exports.formatDates = list => {
  return (result = list.map(Obj => {
    const jsDateObj = new Date(Obj.created_at);
    Obj.created_at = jsDateObj;
    return Obj;
  }));
};
const formatDates = exports.formatDates;

exports.makeRefObj = list => {
  const keys = Object.keys(list[0]);
  const titleKey = keys[1];
  const idKey = keys[0];
  return list.reduce((acc, val) => {
    acc[val[titleKey]] = val[idKey];
    return acc;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  let newComments = [];
  comments.forEach(commentObj => {
    let commentObjCopy = { ...commentObj };
    const created_by = commentObjCopy.created_by;
    commentObjCopy.author = created_by;
    delete commentObjCopy.created_by;

    const { belongs_to } = commentObjCopy;
    const article_id = articleRef[belongs_to];
    commentObjCopy.article_id = article_id;
    delete commentObjCopy.belongs_to;

    newComments.push(commentObjCopy);
  });
  return formatDates(newComments);
};
