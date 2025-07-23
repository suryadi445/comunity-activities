import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcumb from "../components/Breadcumb";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsSidebarMinimized(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarMinimized((prev) => !prev);

    const sidebarWidth = isSidebarMinimized ? 64 : 256; // px

    return (
        <div className="h-screen flex bg-gray-200">
            {/* Sidebar fixed */}
            <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

            {/* Main area */}
            <div
                className="flex flex-col flex-1"
                style={{ marginLeft: sidebarWidth }}
            >
                {/* Navbar (fixed height) */}
                <div className="flex-shrink-0">
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                {/* Main content area yang scrollable */}
                <main className="flex-1 overflow-auto p-6 bg-gray-50">
                    <Breadcumb />
                    <div className="bg-white shadow-xl mt-2 rounded-xl px-6 py-3 min-h-full">
                        <Outlet />
                    </div>
                </main>

                {/* Footer (fixed height) */}
                <div className="flex-shrink-0">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
