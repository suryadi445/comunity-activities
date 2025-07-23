import { useEffect, useState, useCallback } from "react";
import Row from "../../components/Row";
import TableComponent from "../../components/Table";
import api from "../../config/axiosConfig";
import { toastError, toastSuccess } from "../../components/Toast";
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import * as FaIcons from 'react-icons/fa';
import Modal from "../../components/Modal";
import InputLabel from "../../components/InputLabel";
import Label from "../../components/Label";
import VirtualizedSelect from 'react-select-virtualized';
import 'react-virtualized/styles.css';
import Loading from "../../components/Loading";
import ConfirmDelete from "../../components/ConfirmDelete.jsx"
import HeaderActions from "../../components/HeaderActions";


const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idMenu, setIdMenu] = useState('');
    const [name, setName] = useState('');
    const [order, setOrder] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isConfirm, setConfirm] = useState(false);
    const [isEditMode, setEditMode] = useState(false);

    const iconOptions = Object.entries(FaIcons)
        .filter(([name]) => name.startsWith("Fa"))
        .map(([key, Icon]) => ({
            label: key.replace("Fa", ""),
            value: key,
            icon: Icon,
        }));

    const columns = [
        { key: "name", label: "Menu" },
        {
            key: "icon",
            label: "Icon",
            render: (iconName) => {
                const IconComponent = FaIcons[iconName];
                return IconComponent ? <IconComponent size={20} /> : null;
            },
        },
        { key: "sort_order", label: "Order" },
        {
            key: "is_active",
            label: "Status",
            render: (value, item) => (
                <label className="flex items-center gap-2 justify-center">
                    <Toggle
                        checked={value}
                        className="custom-classname"
                        onChange={() => handleToggle(item)}
                    />
                </label>
            ),
        },
    ];

    useEffect(() => {
        setRefreshTrigger(prev => prev + 1);
    }, [search]);

    const fetchMenus = useCallback(async (page, limit) => {
        setLoading(true);

        try {
            const response = await api.get(`/api/sidebar-menus?page=${page}&limit=${limit}&search=${search}`);
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

    const handleToggle = async (item) => {
        try {
            const updatedStatus = !item.is_active;
            await api.put(`/api/menu`, {
                id: item.id,
                is_active: updatedStatus,
            });

            const updatedMenus = menus.map(menu =>
                menu.id === item.id ? { ...menu, is_active: updatedStatus } : menu
            );
            setMenus(updatedMenus);

            toastSuccess(`Status Menu "${item.name}" is ${updatedStatus ? "active" : "inactive"}`);
        } catch (error) {
            toastError(error);
        }
    };

    const handleAddMenu = () => {
        setEditMode(false);
        setIsModalOpen(true);
        setIdMenu('');
        setName('');
        setOrder('');
        setSelectedIcon(null);
    }

    const validateForm = () => {
        if (!name || !selectedIcon || !order) {
            toastError("All fields are required");
            return false;
        }
        return true;
    }

    const handleAddSubmit = async () => {
        if (!validateForm()) return false;

        try {
            const response = await api.post(`/api/menu`, {
                name,
                icon: selectedIcon.value,
                sort_order: order,
                is_active: true
            });

            if (response.status === 201) {
                setRefreshTrigger(prev => prev + 1);
                setIsModalOpen(false);
                toastSuccess("Menu added successfully");
            }
        } catch (error) {
            toastError(error);
        }
    }

    const handleEditMenu = (menu) => {
        setEditMode(true);
        setIsModalOpen(true);
        const foundIcon = iconOptions.find(opt => opt.value === menu.icon);

        setSelectedIcon(foundIcon || null);
        setIdMenu(menu.id);
        setName(menu.name);
        setOrder(menu.sort_order);
    };

    const handleEditSubmit = async () => {
        if (!validateForm()) return false;

        try {
            const response = await api.put(`/api/menu`, {
                id: idMenu,
                name,
                icon: selectedIcon.value,
                sort_order: order,
                is_active: true
            });

            if (response.status === 200) {
                setRefreshTrigger(prev => prev + 1);
                setIsModalOpen(false);
                toastSuccess("Menu updated successfully");
            }
        } catch (error) {
            toastError(error);
        }
    }

    const handleDeleteMenu = async (id) => {
        setConfirm(true);
        setIdMenu(id.id);
    };

    const confirmDelete = async () => {
        try {
            const response = await api.delete("/api/menu", {
                data: {
                    id: idMenu
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
                        <h1 className="text-2xl font-bold">Menus</h1>
                    </div>
                </Row>

                <HeaderActions
                    searchValue={searchInput}
                    onSearchChange={setSearchInput}
                    onSearchClick={() => setSearch(searchInput)}
                    tooltip="Add Menu"
                    onButtonClick={handleAddMenu}
                    buttonAdd={true}
                />

                <Row>
                    <TableComponent
                        columns={columns}
                        fetchData={fetchMenus}
                        showEdit={true}
                        showDelete={true}
                        onEdit={handleEditMenu}
                        onDelete={handleDeleteMenu}
                        tooltip="Menu"
                    />
                </Row>
            </main>

            {/* modal */}
            <div>
                <Modal size="max-w-md" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Menu" : "Add Menu"}
                    onAccept={isEditMode ? handleEditSubmit : handleAddSubmit}
                >
                    <Row>
                        <InputLabel label="Name" prop="name" placeholder="Menu Name" required={true} value={name} onChange={(e) => setName(e.target.value)} />

                        <div className="w-full">
                            <Label htmlFor="icon" required={true} label={"Icon"} />
                            <VirtualizedSelect
                                options={iconOptions}
                                value={selectedIcon}
                                onChange={setSelectedIcon}
                                placeholder="Pilih Icon"
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                formatOptionLabel={({ label, icon: Icon }) => (
                                    <div className="flex items-center gap-2">
                                        {Icon && <Icon />}
                                        <span>{label}</span>
                                    </div>
                                )}
                            />
                        </div>

                        <InputLabel type="number" label="Order" prop="order" value={order} required={true} placeholder="Order" onChange={(e) => setOrder(e.target.value)} />
                    </Row>
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

export default Menu;