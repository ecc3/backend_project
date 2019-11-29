exports.formatDates = list => {
  return list.map(({ created_at, ...otherArticleProperties }) => {
    return { created_at: new Date(created_at), ...otherArticleProperties };
  });
};

exports.makeRefObj = (list, idKey, titleKey) => {
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
