const path = process.env.FILE_UPLOAD_PATH || null;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("activity_images", function (table) {
        table.increments("id").primary();
        table.integer("activity_id").unsigned().notNullable()
            .references("id").inTable("activities").onDelete("CASCADE");
        table.string("path", 100).nullable().defaultTo(path);
        table.string("image", 255).notNullable();

        table.uuid("uploaded_by").nullable()
            .references("id").inTable("users")
            .onDelete("SET NULL");

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("activity_images");
};
