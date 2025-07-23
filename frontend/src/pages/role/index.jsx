import { useCallback, useEffect, useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import TableComponent from "../../components/Table";
import Row from "../../components/Row";
import InputLabel from "../../components/InputLabel";
import TextareaLabel from "../../components/TextareaLabel";
import { toastError, toastSuccess } from "../../components/Toast";
import ConfirmDelete from "../../components/ConfirmDelete.jsx"
import Loading from "../../components/Loading";
import api from "../../config/axiosConfig";
import HeaderActions from "../../components/HeaderActions";


const Role = () => {

    const [isModalAdd, setIsModalAdd] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [id, setId] = useState('');
    const [role, setRole] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isConfirm, setConfirm] = useState(false);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const columns = [
        { key: "name", label: "Role Name" },
        { key: "description", label: "Description" },
    ];

    useEffect(() => {
        setRefreshTrigger(prev => prev + 1);
    }, [search]);

    const handleModalAdd = () => {
        setIsEditMode(false);
        setIsModalAdd(true);
        setRole('');
        setDescription('');
    }

    const fetchRoles = useCallback(async (page, limit) => {
        setLoading(true);

        try {
            const response = await api.get(`/api/roles?page=${page}&limit=${limit}&search=${search}`);
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

    const handleSubmitRole = async () => {
        setLoading(true);
        try {
            const response = await api.post("/api/role", {
                role,
                description
            })

            if (response.status === 201) {
                setIsModalAdd(false);
                toastSuccess("Role added successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitRoleEdit = async () => {
        setLoading(true);
        try {
            const response = await api.put("/api/role", {
                id,
                role,
                description
            })

            if (response.status === 200) {
                setIsModalAdd(false);
                toastSuccess("Role updated successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleModalEdit = async (role) => {
        setIsEditMode(true);
        setIsModalAdd(true);

        try {
            const id = role.id;
            const response = await api.get(`/api/role?id=${id}`);
            setId(id);
            setRole(response.data.response.name);
            setDescription(response.data.response.description);
        } catch (error) {
            toastError(error);
        }
    }

    const handleDelete = async (role) => {
        setConfirm(true);
        setId(role.id);
    }

    const confirmDelete = async () => {
        try {
            const response = await api.delete("/api/role", {
                data: {
                    id
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
            {/* main */}
            <main>
                <Row>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Roles</h1>
                    </div>
                </Row>

                <HeaderActions
                    searchValue={searchInput}
                    onSearchChange={setSearchInput}
                    onSearchClick={() => setSearch(searchInput)}
                    tooltip="Add Role"
                    onButtonClick={handleModalAdd}
                    buttonAdd={true}
                />

                <Row>
                    <TableComponent
                        columns={columns}
                        fetchData={fetchRoles}
                        showEdit={true}
                        showDelete={true}
                        onEdit={handleModalEdit}
                        onDelete={handleDelete}
                        tooltip="Role"
                    />
                </Row>
            </main>

            {/* modal */}
            <div>
                <Modal size="max-w-md" isOpen={isModalAdd} title={isEditMode ? "Edit Role" : "Add Role"} onClose={() => setIsModalAdd(false)} onAccept={isEditMode ? handleSubmitRoleEdit : handleSubmitRole}
                >
                    <form>
                        <Row>
                            <InputLabel label="Role Name" prop="role" required={true} value={role} onChange={(e) => setRole(e.target.value)} />
                        </Row>

                        <Row className="mt-3">
                            <TextareaLabel label="Description" prop="description" required={true} value={description} onChange={(e) => setDescription(e.target.value)} />
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
};

export default Role;
