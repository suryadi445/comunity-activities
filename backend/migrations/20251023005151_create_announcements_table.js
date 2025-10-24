/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("announcements", function (table) {
        table.increments("id").primary();
        table.string("category", 100).notNullable();
        table.string("title", 150).notNullable();
        table.text("content").notNullable();
        table.date("start_date").notNullable();
        table.time("start_time").nullable();
        table.date("end_date").nullable();
        table.time("end_time").nullable();
        table.string("image").nullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("announcements");
};
