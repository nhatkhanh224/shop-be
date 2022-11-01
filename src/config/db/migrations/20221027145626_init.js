/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments();
      table.string("name");
      table.string("username");
      table.string("password");
      table.string("address");
      table.string("phone");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at");
    })
    .createTable("categories", function (table) {
      table.increments();
      table.string("name");
      table.integer("parent_id");
      table.string("description");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at");
    })
    .createTable("products", function (table) {
      table.increments();
      table.string("name");
      table.integer("category_id");
      table.integer("price");
      table.string("description");
      table.string("thumbnail");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at");
    })
    .createTable("product_images", function (table) {
      table.increments();
      table.string("link");
      table.integer("product_id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at");
    })
    .createTable("carts", function (table) {
      table.increments();
      table.integer("product_id");
      table.integer("quantity");
      table.integer("total_amount");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
