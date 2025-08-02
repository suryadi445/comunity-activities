/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Kosongkan tabel terlebih dahulu
    await knex("roles").del();

    await knex.raw("ALTER SEQUENCE roles_id_seq RESTART WITH 1");

    // Masukkan data role awal
    await knex("roles").insert([
        {
            name: "Super Admin",
            description: "Super Admin",
        },
        {
            name: "Admin",
            description: "Admin",
        },
        {
            name: "User",
            description: "User",
        },
    ]);
};
