import Logout from "../auth/Logout";
import Users from "../pages/user";
import UsersProfile from "../pages/user/profile";
import Role from "../pages/role";
import Permission from "../pages/permissions";
import Menu from "../pages/menu";
import Settings from "../pages/settings";
import Dashboard from "../pages/dashboard";

const privateRoutes = [
    { path: "logout", element: <Logout /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "users/profile", element: <UsersProfile /> },
    { path: "roles", element: <Role /> },
    { path: "permissions", element: <Permission /> },
    { path: "menus", element: <Menu /> },
    { path: "settings", element: <Settings /> },
];

export default privateRoutes;