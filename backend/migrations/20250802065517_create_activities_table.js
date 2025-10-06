/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("activities", function (table) {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.text("description").nullable();
        table.date("activity_date").notNullable();
        table.time("activity_time").notNullable();
        table.string("location", 255).nullable();
        table.uuid("created_by").references("id").inTable("users").onDelete("SET NULL");
        table.timestamps(true, true);
        table.timestamp("deleted_at").nullable();
        table.uuid("deleted_by").references("id").inTable("users").onDelete("SET NULL");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("activities");
};
