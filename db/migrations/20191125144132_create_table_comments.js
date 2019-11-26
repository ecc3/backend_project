exports.up = function(knex) {
  console.log("creating table comments");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments().primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.text("body");
  });
};

exports.down = function(knex) {
  console.log("removing table comments");
  return knex.schema.dropTable("comments");
};
