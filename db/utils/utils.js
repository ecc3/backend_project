exports.formatDates = list => {
  return list.map(({ created_at, ...otherArticleProperties }) => {
    return { created_at: new Date(created_at), ...otherArticleProperties };
  });
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
  return comments.map(
    ({ belongs_to, created_by, created_at, ...restOfComment }) => {
      return {
        article_id: articleRef[belongs_to],
        author: created_by,
        created_at: new Date(created_at),
        ...restOfComment
      };
    }
  );
};
