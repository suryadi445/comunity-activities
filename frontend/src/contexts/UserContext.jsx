import { createContext, useState, useContext } from "react";
import api from "../config/axiosConfig";

const UserContext = createContext();

function useUser() {
    return useContext(UserContext);
}

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [isCheckingUser, setIsCheckingUser] = useState(false);

    const fetchUser = async () => {
        setIsCheckingUser(true);
        try {
            const response = await api.get("/api/user");
            const userData = response.data.response;

            const roles = userData.roles || [];
            const allPermissions = roles.flatMap(role => role.permissions || []);
            const uniquePermissions = [...new Set(allPermissions)];

            setUser(userData);
            setPermissions(uniquePermissions);
        } catch (error) {
            // console.log(error.code);
            setUser(null);
            setPermissions([]);
            return null;
        }
        setIsCheckingUser(false);
    };

    const logout = () => {
        localStorage.removeItem("last_path");
        setUser(null);
        setPermissions([]);
    };

    const redirectLastPath = (navigate, fallback = "/dashboard") => {
        const lastPath = localStorage.getItem("last_path");
        if (lastPath && lastPath !== "/" && lastPath !== "/register") {
            navigate(lastPath);
        } else {
            navigate(fallback);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                permissions,
                fetchUser,
                logout,
                isCheckingUser,
                redirectLastPath,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider, useUser };
