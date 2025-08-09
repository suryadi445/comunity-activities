import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "./layouts/AdminLayout";
import { publicRoutes, privateRoutes } from "./routes";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import RequireAuth from "./components/RequireAuth";
import TrackLastPath from "./components/TrackLastPath";
import NotFound from "../src/pages/404";

function App() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Router>
            <Toaster />
            {isLoading && <Loading />}

            <TrackLastPath />

            <Routes>
                {publicRoutes(setIsLoading).map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                <Route path="/" element={<AdminLayout />}>
                    {privateRoutes.map(({ path, element }) => (
                        <Route key={path} path={path}
                            element={
                                <RequireAuth>
                                    {element}
                                </RequireAuth>
                            }
                        />
                    ))}
                </Route>

                {/* 404 Not Found Page */}
                <Route path="*" element={<NotFound fullPage />} />
            </Routes>
        </Router>
    );
}

export default App;
