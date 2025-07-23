import Login from "../auth/Login";
import Register from "../auth/Register";

const publicRoutes = (setIsLoading) => [
    {
        path: "/",
        element: <Login setIsLoading={setIsLoading} />
    },
    {
        path: "/register",
        element: <Register setIsLoading={setIsLoading} />
    },
];

export default publicRoutes;
