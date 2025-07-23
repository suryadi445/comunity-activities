// src/utils/getPermissionsByRoute.js
export function getPermissionsByRoute(user, currentPath) {
    if (!user || !user.roles || !currentPath) return [];

    const normalizedPath = currentPath.toLowerCase().replace(/^\//, '');

    const allMenus = user.roles.flatMap(role => role.menus || []);

    const matchedMenu = allMenus.find(menu =>
        menu.menu_name.toLowerCase() === normalizedPath
    );

    return matchedMenu ? matchedMenu.permissions : [];
}
