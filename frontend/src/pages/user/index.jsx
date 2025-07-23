import api from "../../config/axiosConfig";
import { useCallback, useEffect, useState } from "react";
import TableComponent from "../../components/Table";
import Row from "../../components/Row";
import Modal from "../../components/Modal";
import InputLabel from "../../components/InputLabel";
import ConfirmDelete from "../../components/ConfirmDelete";
import { Label, TextInput } from "flowbite-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toastError, toastSuccess } from "../../components/Toast";
import Loading from "../../components/Loading";
import SelectLabel from "../../components/SelectLabel";
import HeaderActions from "../../components/HeaderActions";


function Users() {
    const closeModal = () => { setIsModalOpen(false); };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConfirm, setConfirm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [form, setForm] = useState({
        roles: [],
    });

    // use effect search
    useEffect(() => {
        setRefreshTrigger(prev => prev + 1);
    }, [search]);

    // table column
    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        {
            key: "roles",
            label: "Roles",
            render: (roles = []) => (
                <div className="flex flex-wrap gap-1 justify-center">
                    {roles.map((role, idx) => (
                        <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            ),
        },
    ];

    // table data fetch users
    const fetchUsers = useCallback(async (page, limit) => {
        setLoading(true);

        try {
            const response = await api.get(`/api/users?page=${page}&limit=${limit}&search=${search}`);
            return {
                data: response.data.response.data,
                last_page: response.data.response.last_page
            };
        } catch (error) {
            return {
                data: [],
                last_page: 1
            };
        } finally {
            setLoading(false);
        }

    }, [refreshTrigger, search]);

    // fetch roles
    const fetchRoles = async () => {
        try {
            const res = await api.get("/api/roles");
            setRoles(res.data.response.data);
        } catch (error) {
            toastError("Failed to fetch roles");
        }
    };

    // form change
    const handleFormChange = (e) => {
        const { name, value, multiple, options } = e.target;

        if (multiple) {
            const selectedValues = Array.from(options)
                .filter((option) => option.selected)
                .map((option) => option.value);
            setForm((prev) => ({ ...prev, [name]: selectedValues }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // get validations add and edit user
    const getValidations = (isEdit = false) => {
        const validations = [
            { condition: !name.trim(), message: "Name is required" },
            { condition: !email.trim(), message: "Email is required" },
            { condition: !emailRegex.test(email), message: "Please enter a valid email address" },
            { condition: !form.roles.length, message: "Please select at least one role" },
        ];

        if (!isEdit) {
            validations.push(
                { condition: !password.trim(), message: "Password is required" },
                { condition: password.length < 6, message: "Password must be at least 6 characters" }
            );
        } else {
            if (password.trim()) {
                validations.push({
                    condition: password.length < 6,
                    message: "Password must be at least 6 characters"
                });
            }
        }

        return validations;
    };

    // open add modal
    const openAddModal = () => {
        setIsEditMode(false);
        setName('');
        setEmail('');
        setPassword('11111111');
        setIsModalOpen(true);
        fetchRoles();
        setForm({ roles: [] });
    }

    // submit add user
    const submitAddUser = async () => {
        const validations = getValidations(false);
        const isValid = validations.every(validation => !validation.condition);
        if (!isValid) {
            toastError(validations.find(validation => validation.condition).message);
            return false;
        }

        try {
            const response = await api.post("/api/auth/register", {
                name,
                email,
                password,
                roles: form.roles
            });

            if (response.status === 201) {
                setRefreshTrigger(prev => prev + 1);
                setIsModalOpen(false);
                toastSuccess("User added successfully");
            }
        } catch (error) {
            const res = error?.response;

            if (res?.status === 422 && Array.isArray(res?.data?.response)) {
                toastError(res.data.response.join("\n"));
                return false;
            } else {
                toastError(error);
            }
        }
    }

    // open edit modal
    const handleEdit = async (user) => {
        setIsEditMode(true);
        setIsModalOpen(true);
        setPassword('');
        fetchRoles();

        try {
            const response = await api.get("/api/user?id=" + user.id);
            setName(response.data.response.name);
            setEmail(response.data.response.email);
            setUserId(response.data.response.user_id);
            setForm(
                {
                    roles: response.data.response.roles.map(role => String(role.id))
                }
            );
        } catch (error) {
            const res = error?.response;

            if (res?.status === 422 && Array.isArray(res?.data?.response)) {
                toastError(res.data.response.join("\n"));
                return false;
            } else {

                toastError(error);
            }
        }
    };

    // submit edit user
    const submitEditUser = async () => {
        const validations = getValidations(true);
        const isValid = validations.every(validation => !validation.condition);
        if (!isValid) {
            toastError(validations.find(validation => validation.condition).message);
            return false;
        }

        try {
            const response = await api.put("/api/user", {
                email,
                name,
                password,
                id: userId,
                roles: form.roles
            })

            if (response.status === 200) {
                setRefreshTrigger(prev => prev + 1);

                setIsModalOpen(false);

                toastSuccess("Update Successfully");
            }
        } catch (error) {
            toastError(error);
        }
    }

    // delete user
    const handleDelete = async (user) => {
        setConfirm(true);
        setUserId(user.id);
    };

    // confirm delete
    const confirmDelete = async () => {
        try {
            const response = await api.delete("/api/user", {
                data: {
                    id: userId
                }
            });
            if (response.status === 200) {
                setRefreshTrigger(prev => prev + 1);
                setConfirm(false);
                toastSuccess("Delete Successfully");
            }
        } catch (error) {
            toastError(error);
        }
    }

    return (
        <div>
            <main>
                <Row>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Users</h1>
                    </div>
                </Row>

                <HeaderActions
                    searchValue={searchInput}
                    onSearchChange={setSearchInput}
                    onSearchClick={() => setSearch(searchInput)}
                    tooltip="Add User"
                    onButtonClick={openAddModal}
                    buttonAdd={true}
                />

                <Row>
                    <TableComponent
                        columns={columns}
                        fetchData={fetchUsers}
                        showEdit={true}
                        showDelete={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        tooltip="User"
                    />
                </Row>
            </main>

            {/* modal */}
            <div>
                <Modal isOpen={isModalOpen} title={isEditMode ? "Edit User" : "Add User"} onClose={closeModal} onAccept={isEditMode ? submitEditUser : submitAddUser}
                >
                    <form>
                        <Row cols={2}>
                            <InputLabel label="Name" prop="name" required={true} value={name} onChange={(e) => setName(e.target.value)} />

                            <InputLabel label="Email" prop="email" type="email" required={true} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Row>

                        <Row cols={2} className="mt-3">
                            <div className="mt-3">
                                <Label htmlFor="password" className="text-sm font-medium text-black dark:text-black">Password</Label>
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        value={password}
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            border: "1px solid #D1D5DB",
                                            borderRadius: "0.375rem",
                                        }}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-5 flex items-center text-gray-800 hover:text-gray-500"
                                    >
                                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </button>
                                </div>
                                {isEditMode && <small className="text-red-500">Input if you want to change password</small>}
                            </div>

                            <div className="mt-3">
                                <SelectLabel
                                    label="Roles"
                                    prop="roles"
                                    multiple={true}
                                    required={true}
                                    value={form.roles}
                                    onChange={handleFormChange}
                                    options={roles.map((role) => ({
                                        value: String(role.id),
                                        label: role.name,
                                    }))}
                                />
                            </div>

                        </Row>
                    </form>
                </Modal>
            </div>

            {/* utility */}
            <div>
                {/* loading */}
                {loading && <Loading />}

                {/* confirm */}
                <ConfirmDelete
                    isOpen={isConfirm}
                    onClose={() => setConfirm(false)}
                    onConfirm={confirmDelete}
                />
            </div>

        </div>
    );
}

export default Users;
