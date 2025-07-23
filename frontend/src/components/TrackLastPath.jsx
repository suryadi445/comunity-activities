import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const excludedPaths = ["/", "/register"];

const TrackLastPath = () => {
    const location = useLocation();

    useEffect(() => {
        if (!excludedPaths.includes(location.pathname)) {
            localStorage.setItem("last_path", location.pathname);
        }
    }, [location]);

    return null;
};

export default TrackLastPath;
