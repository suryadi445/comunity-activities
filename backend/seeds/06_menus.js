/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Hapus data lama dulu
    await knex("menus").del();
    await knex.raw("ALTER SEQUENCE menus_id_seq RESTART WITH 1");

    // Insert data menu
    await knex("menus").insert([
        {
            name: "Dashboard",
            icon: "FaLaptopHouse",
            route: "/dashboard",
            parent_id: null,
            sort_order: 1,
            is_active: true,
        },
        {
            name: "Users",
            icon: "FaUsers",
            route: "/users",
            parent_id: null,
            sort_order: 2,
            is_active: true,
        },
        {
            name: "Roles",
            icon: "FaShieldAlt",
            route: "/roles",
            parent_id: null,
            sort_order: 3,
            is_active: true,
        },
        {
            name: "Permissions",
            icon: "FaKey",
            route: "/permissions",
            parent_id: null,
            sort_order: 4,
            is_active: true,
        },
        {
            name: "Settings",
            icon: "FaCog",
            route: "/settings",
            parent_id: null,
            sort_order: 5,
            is_active: true,
        },
        {
            name: "Menus",
            icon: "FaListUl",
            route: "/menus",
            parent_id: null,
            sort_order: 6,
            is_active: true,
        },
        {
            name: "Cash Report",
            icon: "FaMoneyBillWave",
            route: "/cash-reports",
            parent_id: null,
            sort_order: 7,
            is_active: true,
        },
    ]);
};
