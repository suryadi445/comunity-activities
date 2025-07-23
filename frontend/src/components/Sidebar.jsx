import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import api from "../config/axiosConfig";

const Sidebar = ({ isMinimized, toggleSidebar }) => {
    const [menus, setMenus] = useState([]);
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenusByRole = async () => {
            try {
                setLoading(true);
                const res = await api.get("/api/menu-role");
                setMenus(res.data.response || []);
            } catch (error) {
                console.error("Failed to fetch menus by role:", error);
                setMenus([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchSettings = async () => {
            try {
                const res = await api.get("/api/settings-apps");
                setSettings(res.data.response);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };

        fetchSettings();
        fetchMenusByRole();
    }, []);

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col ${isMinimized ? "w-16" : "w-64"
                }`}
        >
            <div className="flex items-center justify-between p-4 flex-shrink-0">
                <h4 className={`text-lg font-bold ${isMinimized ? "hidden" : "block"}`}>
                    {settings?.apps_name || "Admin Panel"}
                </h4>
                <button
                    className="text-white p-2 rounded hover:bg-gray-700"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    <FaIcons.FaBars />
                </button>
            </div>

            {loading ? (
                <div className="p-4 text-center text-gray-300">Loading menus...</div>
            ) : menus.length === 0 ? (
                <div className="p-4 text-center text-gray-300">No menus available</div>
            ) : (
                <ul className="flex-1 overflow-auto space-y-2 p-2">
                    {menus.map((menu) => {
                        const Icon = FaIcons[menu.icon] || FaIcons.FaHome;
                        return (
                            <li key={menu.id}>
                                <Link
                                    to={menu.route}
                                    className="flex items-center p-3 rounded hover:bg-gray-700"
                                >
                                    <Icon className="text-xl" />
                                    {!isMinimized && <span className="ml-3">{menu.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
};

export default Sidebar;
