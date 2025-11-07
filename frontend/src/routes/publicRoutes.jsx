import LandingPage from "../pages/landing";
import Login from "../auth/Login";
import Register from "../auth/Register";

const publicRoutes = (setIsLoading) => [
    {
        path: "/",
        element: <LandingPage setIsLoading={setIsLoading} />
    },
    // {
    //     path: "/login",
    //     element: <Login setIsLoading={setIsLoading} />
    // },
    // {
    //     path: "/register",
    //     element: <Register setIsLoading={setIsLoading} />
    // },
];

export default publicRoutes;
