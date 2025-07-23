import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";

function Breadcumb() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-300 rounded-xl">
            <Breadcrumb.Item icon={HiHome}>
                <Link to="/dashboard" className="text-gray-100 hover:text-blue-600 transition-colors duration-300">
                    Home
                </Link>
            </Breadcrumb.Item>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <Breadcrumb.Item key={name}>{name}</Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item key={name}>
                        <Link to={routeTo} className="text-gray-100 hover:text-blue-600 transition-colors duration-300">{name}</Link>
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
}

export default Breadcumb;
