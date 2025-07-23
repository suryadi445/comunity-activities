import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function AdminNavbar() {
    const { user } = useUser();

    return (
        <Navbar fluid className="bg-white shadow-md dark:bg-gray-900">
            <Navbar.Brand as={Link} to="/dashboard"></Navbar.Brand>

            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={<Avatar alt="User settings" img={user?.image ? user.path + user.image : "../../images/user.jpg"} rounded />}
                >
                    <Dropdown.Header>
                        <span className="block text-sm">
                            {user?.name}
                        </span>
                        <small className="block truncate text-sm font-medium">
                            {user?.email}
                        </small>
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} to="/users/profile">
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/dashboard">
                        Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                        Settings Apps
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/logout">
                        Sign out
                    </Dropdown.Item>
                </Dropdown>
            </div>
        </Navbar>
    );
}

export default AdminNavbar;
