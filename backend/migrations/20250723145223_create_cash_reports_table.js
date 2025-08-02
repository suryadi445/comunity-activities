/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("cash_reports", function (table) {
        table.increments("id").primary();
        table.date("date").notNullable();
        table.string("description", 255).notNullable();
        table.decimal("amount", 15, 2).notNullable();
        table.enu("type", ["in", "out"]).notNullable();
        table.string("category", 100).nullable();
        table.uuid("user_id").references("id").inTable("users").onDelete("SET NULL");
        table.timestamps(true, true);
        table.timestamp("deleted_at").nullable();
        table.string("reason", 255).nullable();
        table.uuid("deleted_by").references("id").inTable("users").onDelete("SET NULL");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
