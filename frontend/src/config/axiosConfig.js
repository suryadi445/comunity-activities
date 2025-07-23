import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const checkAndRefreshToken = async (error) => {
    // If response != 401 and response not empty, reject it
    if (!error.response || error.status !== 401) {
        return Promise.reject(error);
    }

    // prevent refresh loop if error come from this endpoint refresh-token
    if (error.config.url.includes("/api/auth/refresh-token")) {
        return Promise.reject(error);
    }

    try {
        // try to refresh token
        const refreshResponse = await api.post("/api/auth/refresh-token");

        if (refreshResponse.status === 200) {
            // Get new token
            const newAccessToken = refreshResponse.data.accessToken;
            api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // return request failed
            return api(error.config);
        }
    } catch (refreshError) {
        return Promise.reject(refreshError);
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const requestUrl = error?.config?.url;
        const currentPath = window.location.pathname;

        if (currentPath === "/" || currentPath === "/register") {
            return Promise.reject(error);
        }

        if (
            requestUrl?.includes("/api/auth/login") ||
            requestUrl?.includes("/api/auth/register")
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            window.location.replace("/");
            return;
        }

        return checkAndRefreshToken(error);
    }
);
export default api;
