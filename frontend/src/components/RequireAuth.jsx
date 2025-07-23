import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

function RequireAuth({ children }) {
    const { user, fetchUser, isCheckingUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user && !isCheckingUser) {
            fetchUser();
        }
    }, [user, isCheckingUser]);

    useEffect(() => {
        if (!user && !isCheckingUser && location.pathname !== "/") {
            navigate("/", { replace: true });
        }
    }, [user, isCheckingUser, location.pathname]);

    if (isCheckingUser) return null; // atau loading spinner

    return user ? children : null;
}

export default RequireAuth;
