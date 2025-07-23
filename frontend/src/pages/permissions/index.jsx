import { useCallback, useEffect, useState } from "react";
import Modal from "../../components/Modal";
import TableComponent from "../../components/Table";
import Row from "../../components/Row";
import api from "../../config/axiosConfig";
import { toastError, toastSuccess } from "../../components/Toast";
import SelectLabel from "../../components/SelectLabel";
import ConfirmDelete from "../../components/ConfirmDelete.jsx"
import Loading from "../../components/Loading";
import HeaderActions from "../../components/HeaderActions";

const Permission = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [menus, setMenus] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isConfirm, setConfirm] = useState(false);
    const [form, setForm] = useState({
        permission: [],
        menu: [],
        role: "",
    });

    const handleFormChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const columns = [
        { key: "role_name", label: "Role Name" },
        { key: "menu_name", label: "Menu Name" },
        {
            key: "permissions",
            label: "Permissions",
            render: (value) => (
                <div className="flex flex-wrap gap-1 justify-center">
                    {(value || []).map((perm, idx) => (
                        <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                            {perm}
                        </span>
                    ))}
                </div>
            ),
        },
    ];


    useEffect(() => {
        setRefreshTrigger(prev => prev + 1);
    }, [search]);

    const fetchRolePermission = useCallback(async (page, limit) => {
        setLoading(true);

        try {
            const response = await api.get(`/api/role-permissions?page=${page}&limit=${limit}&search=${search}`);
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

    const fetchPermission = async () => {
        try {
            const res = await api.get("/api/permissions");
            setPermissions(res.data.response);
        } catch (error) {
            toastError(error);
        }
    };

    const fetchMenus = async () => {
        try {
            const res = await api.get("/api/menus");
            setMenus(res.data.response);
        } catch (error) {
            toastError(error);
        }
    };

    const fetchRole = async () => {
        try {
            const res = await api.get("/api/roles");
            setRoles(res.data.response.data);
        } catch (error) {
            toastError(error);
        }
    };

    const handleModalAdd = () => {
        form.menu = [];
        form.permission = [];
        form.role = "";
        fetchMenus();
        fetchRole();
        fetchPermission();
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const submitAddPermission = async () => {

        if (!form.role) {
            toastError("Role is required");
            return false;
        }
        if (form.menu.length === 0) {
            toastError("Menu is required");
            return false;
        }
        if (form.permission.length === 0) {
            toastError("Permission is required");
            return false;
        }

        try {
            const response = await api.post("/api/permissions", form);
            if (response.status === 201) {
                setIsModalOpen(false);
                toastSuccess("Permission added successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    }

    const handleModalEdit = async (data) => {
        setIsEditMode(true);

        await fetchMenus();
        await fetchRole();
        await fetchPermission();

        setForm({
            menu: data.menu_id ? [data.menu_id] : [],
            permission: Array.isArray(data.permissions) ? data.permissions : [],
            role: data.role_id ?? '',
        });

        setIsModalOpen(true);
    };

    const submitEditPermission = async () => {
        try {
            const response = await api.put("/api/role-permissions", form);
            if (response.status === 200) {
                setIsModalOpen(false);
                toastSuccess("Permission updated successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    }

    const handleDelete = (data) => {
        setRoles(Array.isArray(data.role_id) ? data.role_id : [data.role_id]);
        setPermissions(data.permissions);
        setMenus(Array.isArray(data.menu_id) ? data.menu_id : [data.menu_id]);
        setConfirm(true);
    }

    const confirmDelete = async () => {
        try {
            const response = await api.delete("/api/role-permissions", {
                data: {
                    role: Array.isArray(roles) ? roles[0] : roles,
                    permission: permissions,
                    menu: Array.isArray(menus) ? menus[0] : menus
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
                        <h1 className="text-2xl font-bold">Permissions</h1>
                    </div>
                </Row>

                <HeaderActions
                    searchValue={searchInput}
                    onSearchChange={setSearchInput}
                    onSearchClick={() => setSearch(searchInput)}
                    tooltip="Add Permission"
                    onButtonClick={handleModalAdd}
                    buttonAdd={true}
                />

                <Row>
                    <TableComponent
                        columns={columns}
                        fetchData={fetchRolePermission}
                        showEdit={true}
                        showDelete={true}
                        onEdit={handleModalEdit}
                        onDelete={handleDelete}
                        tooltip="Permission"
                    />
                </Row>
            </main>

            {/* modal */}
            <div>
                <Modal
                    isOpen={isModalOpen}
                    title={isEditMode ? "Edit Permission" : "Add Permission"}
                    onClose={() => { setIsModalOpen(false) }}
                    onAccept={isEditMode ? submitEditPermission : submitAddPermission}
                >
                    <form>
                        <Row>
                            {/* role */}
                            <SelectLabel disabled={isEditMode} label={"Role"} prop="role" required={true} value={form.role} onChange={handleFormChange} options={roles.map(role => ({
                                value: role.id,
                                label: role.name
                            }))} />
                        </Row>

                        <Row cols={2} className="mt-3">
                            {/* menu */}
                            <SelectLabel disabled={isEditMode} label="Menu" prop="menu" multiple={true} required={true} value={form.menu} onChange={handleFormChange} options={
                                menus.map(menu => ({
                                    value: menu.id,
                                    label: menu.name
                                }))
                            } />

                            {/* permission */}
                            <SelectLabel multiple={true} label="Permission" prop="permission" required={true} placeholder="Please Choose" options={
                                permissions.map(permission => ({
                                    value: permission.name,
                                    label: permission.description
                                }))
                            } value={form.permission} onChange={handleFormChange} />
                        </Row>
                    </form>
                </Modal>
            </div>

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
};

export default Permission;
