import { FaBullhorn, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import CardBox from "../../components/CardBox";
import HeaderActions from "../../components/HeaderActions";
import InputLabel from "../../components/InputLabel";
import Row from "../../components/Row";
import TableComponent from "../../components/Table";
import Modal from "../../components/Modal";
import { useCallback, useEffect, useState } from "react";
import DatepickerLabel from "../../components/DatepickerLabel";
import TextareaLabel from "../../components/TextareaLabel";
import { toastError, toastSuccess } from "../../components/Toast";
import api from "../../config/axiosConfig";
import Loading from "../../components/Loading";
import ConfirmDelete from "../../components/ConfirmDelete";

const Announcements = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcementId, setAnnouncementId] = useState("");
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConfirm, setConfirm] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const formatDate = (e) => {
        const date = new Date(e);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const filter = [
        {
            type: "select",
            label: "Status",
            prop: "type",
            value: typeFilter,
            onChange: (e) => {
                setTypeFilter(e.target.value);
                setRefreshTrigger(prev => prev + 1);
            },
            options: [
                { label: "All", value: "" },
                { label: "Active", value: "active" },
                { label: "Non Active", value: "nonactive" },
                { label: "Berlangsung", value: "berlangsung" },
                { label: "Kedaluarsa", value: "kedaluarsa" },
            ]
        },
    ];

    const columns = [
        { key: "category", label: "Category" },
        { key: "title", label: "Title" },
        { key: "content", label: "Content" },
        { key: "start_date", label: "Start Date" },
        { key: "start_time", label: "Start Time" },
        { key: "end_date", label: "End Date" },
        { key: "end_time", label: "End Time" },
        {
            key: "status",
            label: "Status",
            render: (_, row) => (
                <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {row.is_active ? (
                            <><FaCheckCircle className="w-3 h-3" /> Aktif</>
                        ) : (
                            <><FaTimesCircle className="w-3 h-3" /> Nonaktif</>
                        )}
                    </span>
                    {row.is_active && (
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${row.is_current ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                            }`}>
                            <FaClock className="w-3 h-3" />
                            {row.is_current ? "Sedang Berlangsung" : "Kedaluwarsa"}
                        </span>
                    )}
                </div>
            ),
        },
    ];

    const handleModalAdd = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setCategory("");
        setTitle("");
        setContent("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
        setIsActive(true);
    };

    const fetchData = useCallback(async (page, limit) => {
        setLoading(true);
        try {
            const response = await api.get(
                `/api/announcement?page=${page}&limit=${limit}` +
                `&search=${encodeURIComponent(search || "")}` +
                `&type=${encodeURIComponent(typeFilter || "")}`
            );
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
    }, [refreshTrigger, typeFilter, search]);

    const handleSubmit = async () => {
        if (!category || !title || !content || !startDate || !startTime || !endDate || !endTime) {
            toastError("Please fill all required input.");
            return false;
        }

        try {
            const response = await api.post("/api/announcement", {
                category,
                title,
                content,
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
                is_active: isActive
            });
            if (response.status === 201) {
                toastSuccess("Announcement added successfully");
                setIsModalOpen(false);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleEdit = async (e) => {
        setIsModalOpen(true);
        setIsEditMode(true);
        setAnnouncementId(e.id);
        setCategory(e.category);
        setTitle(e.title);
        setContent(e.content);
        setStartDate(formatDate(e.start_date));
        setStartTime(e.start_time);
        setEndDate(formatDate(e.end_date));
        setEndTime(e.end_time);
        setIsActive(e.is_active);
    };

    const handleSubmitEdit = async () => {
        if (!category || !title || !content || !startDate || !startTime || !endDate || !endTime) {
            toastError("Please fill all required input.");
            return false;
        }

        try {
            const response = await api.put(`/api/announcement`, {
                id: announcementId,
                category,
                title,
                content,
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
                is_active: isActive
            });
            if (response.status === 200) {
                toastSuccess("Announcement updated successfully");
                setIsModalOpen(false);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleDelete = (e) => {
        setAnnouncementId(e.id);
        setConfirm(true);
    };

    const submitDelete = async () => {
        try {
            const response = await api.delete("/api/announcement", {
                data: { id: announcementId }
            });
            if (response.status === 200) {
                setRefreshTrigger(prev => prev + 1);
                setConfirm(false);
                toastSuccess("Deleted successfully");
            }
        } catch (error) {
            toastError(error);
        }
    };

    useEffect(() => {
        fetchData(1, 10);
    }, [refreshTrigger]);

    return (
        <>
            <main>
                <Row>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold flex items-center">
                            Announcements
                        </h1>
                    </div>
                </Row>

                <CardBox>
                    <HeaderActions
                        tooltip="Add Announcement"
                        onButtonClick={handleModalAdd}
                        buttonAdd={true}
                        inputSearch={true}
                        filter={filter}
                        searchValue={searchInput}
                        onSearchChange={setSearchInput}
                        onSearchClick={() => { setSearch(searchInput); setRefreshTrigger(prev => prev + 1); }}
                    />

                    <Row>
                        <TableComponent
                            columns={columns}
                            fetchData={fetchData}
                            showEdit={true}
                            showDelete={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            tooltip="Announcement"
                        />
                    </Row>
                </CardBox>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAccept={isEditMode ? handleSubmitEdit : handleSubmit}
                onDecline={() => setIsModalOpen(false)}
                title={isEditMode ? "Edit Announcement" : "Add Announcement"}
            >
                <Row cols={2}>
                    <InputLabel
                        label="Category"
                        prop="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required={true}
                        placeholder="Enter Category"
                    />
                    <InputLabel
                        label="Title"
                        prop="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required={true}
                        placeholder="Enter Title"
                    />
                </Row>

                <Row>
                    <TextareaLabel
                        label="Content"
                        prop="content"
                        placeholder="Enter Content"
                        required={true}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Row>

                <Row cols={2}>
                    <DatepickerLabel
                        label="Start Date"
                        prop="start_date"
                        required={true}
                        value={startDate}
                        onChange={(e) => setStartDate(formatDate(e))}
                    />
                    <InputLabel
                        label="Start Time"
                        prop="start_time"
                        required={true}
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </Row>

                <Row cols={2}>
                    <DatepickerLabel
                        label="End Date"
                        prop="end_date"
                        required={true}
                        value={endDate}
                        onChange={(e) => setEndDate(formatDate(e))}
                    />
                    <InputLabel
                        label="End Time"
                        prop="end_time"
                        required={true}
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </Row>

                <Row>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <label htmlFor="is_active">Active</label>
                    </div>
                </Row>
            </Modal>

            {loading && <Loading />}

            <ConfirmDelete
                isOpen={isConfirm}
                onClose={() => setConfirm(false)}
                onConfirm={submitDelete}
            />
        </>
    );
};

export default Announcements;
