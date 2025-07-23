import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosConfig";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const doLogout = async () => {
            try {
                await api.post("/api/auth/logout");
                localStorage.removeItem("user");
                navigate("/", { replace: true });
            } catch (error) {
                console.error(error);
                localStorage.removeItem("user");
                navigate("/", { replace: true });
            }
        };

        doLogout();
    }, [navigate]);

    return null;
};

export default Logout;
