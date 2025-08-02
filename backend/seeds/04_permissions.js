/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Kosongkan tabel permissions
    await knex("permissions").del();
    await knex.raw("ALTER SEQUENCE permissions_id_seq RESTART WITH 1");

    // Tambahkan data CRUD permissions
    await knex("permissions").insert([
        {
            name: "create",
            description: "Create data",
        },
        {
            name: "read",
            description: "Read data",
        },
        {
            name: "update",
            description: "Update data",
        },
        {
            name: "delete",
            description: "Delete data",
        },
    ]);
};
