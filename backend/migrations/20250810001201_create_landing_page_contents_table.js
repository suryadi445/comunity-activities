const pathDefault = process.env.FILE_UPLOAD_PATH || null;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('landing_page_contents', function (table) {
        table.increments('id').primary();
        table.enu('type', ['slideshow', 'transaction', 'structure', 'footer', 'about_us', 'default']).notNullable();

        table.uuid('user_id').notNullable();
        table.boolean('is_edit').defaultTo(false);

        // Slideshow
        table.string('header').nullable();
        table.string('title').nullable();
        table.string('path', 100).nullable();
        table.string('image').nullable();

        // global
        table.text('description').nullable();

        // Structure
        table.string('leader_title').nullable();
        table.string('leader_name').nullable();
        table.string('leader_phone').nullable();
        table.string('assistant_title').nullable();
        table.string('assistant_name').nullable();
        table.string('assistant_phone').nullable();

        // Footer
        table.string('latitude').nullable();
        table.string('longitude').nullable();
        table.text('footer').nullable();

        // About Us
        table.text('vision_mission').nullable();
        table.text('principle').nullable();

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('landing_page_contents');
};
