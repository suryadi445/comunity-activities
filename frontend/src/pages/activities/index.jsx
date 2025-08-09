import { FaCalendarCheck } from "react-icons/fa";
import CardBox from "../../components/CardBox";
import HeaderActions from "../../components/HeaderActions";
import InputLabel from "../../components/InputLabel";
import Row from "../../components/Row";
import TableComponent from "../../components/Table";
import Tabs from "../../components/Tabs";
import Modal from "../../components/Modal";
import { useCallback, useEffect, useState } from "react";
import DatepickerLabel from "../../components/DatepickerLabel";
import TextareaLabel from "../../components/TextareaLabel";
import { toastError, toastSuccess } from "../../components/Toast";
import api from "../../config/axiosConfig";
import Loading from "../../components/Loading";
import ConfirmDelete from "../../components/ConfirmDelete";
import SelectLabel from "../../components/SelectLabel";

const Activities = () => {
    const [isModalActivityOpen, setIsModalActivityOpen] = useState(false);
    const [isModalImageOpen, setIsModalImageOpen] = useState(false);
    const [activityId, setActivityId] = useState("");
    const [title, setTitle] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConfirm, setConfirm] = useState(false);
    const [optionsTitle, setOptionsTitle] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const formatDate = (e) => {
        const date = new Date(e);

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const columnsActivity = [
        { key: "title", label: "Title" },
        { key: "activity_date", label: "Activity Date" },
        { key: "description", label: "Description" },
        { key: "location", label: "Location" },
    ];

    // activity
    const handleModalAddActivity = () => {
        setIsModalActivityOpen(true);
        setIsEditMode(false);
        setTitle("");
        setActivityDate("");
        setLocation("");
        setDescription("");
    };

    const fetchDataActivity = useCallback(async (page, limit) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/activities?page=${page}&limit=${limit}`);
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
    }, [refreshTrigger]);

    const handleSubmitActivity = async () => {
        try {
            const response = await api.post("/api/activity", {
                title,
                activity_date: activityDate,
                description,
                location,
            });
            if (response.status === 201) {
                toastSuccess("Activity added successfully");
                setIsModalActivityOpen(false);
                setTitle("");
                setActivityDate("");
                setLocation("");
                setDescription("");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleEditActivity = async (e) => {
        setIsModalActivityOpen(true);
        setIsEditMode(true);
        setTitle(e.title);
        setActivityDate(formatDate(e.activity_date));
        setLocation(e.location);
        setDescription(e.description);
        setActivityId(e.id);
    }

    const handleSubmitEditActivity = async () => {

        try {
            const response = await api.put(`/api/activity`, {
                id: activityId,
                title,
                activity_date: activityDate,
                description,
                location,
            });
            if (response.status === 200) {
                toastSuccess("Activity updated successfully");
                setIsModalActivityOpen(false);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleDeleteActivity = (e) => {
        setActivityId(e.id);
        setConfirm(true);
    }

    const submitDeleteActivity = async () => {
        try {
            const response = await api.delete("/api/activity", {
                data: {
                    id: activityId
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

    // Images
    const columnsImages = [
        { key: "title", label: "Title" },
        { key: "activity_date", label: "Activity Date" },
        { key: "description", label: "Description" },
        { key: "location", label: "Location" },
    ]

    const fetchDataImages = useCallback(async (page, limit) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/images-activity?page=${page}&limit=${limit}`);
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
    }, [refreshTrigger]);

    const handleModalAddImages = async () => {
        setIsEditMode(false);
        setIsModalImageOpen(true);
        setSelectedFiles([]);
        setActivityId("");

        try {
            const res = await fetchDataActivity(1, 10);
            setOptionsTitle(res.data.map((item) => ({ value: item.id, label: item.title + " (" + formatDate(item.activity_date) + ")" })));
        } catch (error) {
            toastError(error);
        }
    }

    const handleSubmitImages = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            toastError("Please select at least one image.");
            return false;
        }

        if (!activityId) {
            toastError("Please select an activity.");
            return false;
        }

        try {
            const formData = new FormData();
            formData.append("activity_id", activityId);
            selectedFiles.forEach((file) => {
                formData.append("image[]", file);
            });

            const response = await api.post("/api/images-activity", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.status === 201) {
                toastSuccess("Images uploaded successfully");
            } else if (response.status === 207 || response.status === 409) {
                const resData = response.data.response;

                const failedFiles = resData.failed.map(file => {
                    return `${file.name} - ${file.error}`;
                }).join('\n');

                toastError(`Some images failed to upload:\n${failedFiles}`);
            }

            // Tetap reset modal dan data
            setIsModalImageOpen(false);
            setSelectedFiles([]);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toastError(error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // convert FileList to array
        setSelectedFiles(files);
    };

    const handleEditImages = (e) => {
        setIsModalImageOpen(true);
        setSelectedImages(e);
        setActivityId(e.id);
        setIsEditMode(true);
    }

    const handleDeleteImage = async (imageNameToDelete) => {
        const updatedImages = selectedImages.images.filter(
            (img) => img !== imageNameToDelete
        );
        setSelectedImages({
            ...selectedImages,
            images: updatedImages,
        });

        try {
            const response = await api.delete(`/api/images-activity`, {
                data: {
                    image: imageNameToDelete
                }
            });

            if (response.status == 200) {
                toastSuccess("Image deleted successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    useEffect(() => {
        fetchDataActivity(1, 10);
        fetchDataImages(1, 10);
    }, [refreshTrigger]);


    const tabs = [
        {
            key: "activity",
            title: (
                <div className="flex items-center">
                    <FaCalendarCheck className="mr-2" />
                    Activity
                </div>
            ),
            content: (
                <>
                    <main>
                        <HeaderActions
                            tooltip="Add Activity"
                            onButtonClick={handleModalAddActivity}
                            buttonAdd={true}
                            inputSearch={false}
                        />

                        <Row>
                            <TableComponent
                                columns={columnsActivity}
                                fetchData={fetchDataActivity}
                                showEdit={true}
                                showDelete={true}
                                onEdit={handleEditActivity}
                                onDelete={handleDeleteActivity}
                                tooltip="Cash Report"
                            />
                        </Row>
                    </main>
                </>
            ),
        },
        {
            key: "images",
            title: <div className="flex items-center">Images</div>,
            content: <>
                <main>
                    <HeaderActions
                        tooltip="Add Images"
                        onButtonClick={handleModalAddImages}
                        buttonAdd={true}
                        inputSearch={false}
                    />

                    <Row>
                        <TableComponent
                            columns={columnsImages}
                            fetchData={fetchDataImages}
                            showEdit={true}
                            showDelete={false}
                            onEdit={handleEditImages}
                            tooltip="Images Activity"
                        />
                    </Row>
                </main>
            </>,
        },
    ];

    return (
        <>
            <main>
                <Row>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Activities</h1>
                    </div>
                </Row>

                <CardBox>
                    <Tabs tabs={tabs} />
                </CardBox>
            </main>

            {/* modal activity */}
            <Modal
                isOpen={isModalActivityOpen}
                onClose={() => setIsModalActivityOpen(false)}
                onAccept={isEditMode ? handleSubmitEditActivity : handleSubmitActivity}
                onDecline={() => setIsModalActivityOpen(false)}
                title={isEditMode ? "Edit Activity" : "Add Activity"}
            >
                <Row cols={2}>
                    <InputLabel
                        label="Title"
                        prop="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Title"
                    />
                    <DatepickerLabel
                        label="Activity Date"
                        prop="activity_date"
                        value={activityDate}
                        onChange={(e) => setActivityDate(formatDate(e))}
                    />
                </Row>
                <Row cols={2}>
                    <InputLabel
                        label="Location"
                        prop="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter Location"
                    />
                    <TextareaLabel
                        label="Description"
                        prop="description"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Row>
            </Modal>

            {/* modal images */}
            <Modal
                isOpen={isModalImageOpen}
                onClose={() => setIsModalImageOpen(false)}
                onAccept={handleSubmitImages}
                onDecline={() => setIsModalImageOpen(false)}
                title={isEditMode ? "Edit Images" : "Add Images"}
            >
                <Row cols={2}>
                    <SelectLabel label="Title of Activity" required prop="title" value={activityId} options={optionsTitle} onChange={(e) => setActivityId(Number(e.target.value))} />
                    <InputLabel label="Image" prop="image" multiple={true} helpText="PNG, JPG or JPEG" type="file" required={true} onChange={handleFileChange} />
                </Row>

                {isEditMode && selectedImages?.images?.map && (
                    <Row>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {selectedImages.images.map((imageName, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: "relative",
                                        width: "100px",
                                        height: "100px",
                                    }}
                                >
                                    <img
                                        src={`${selectedImages.path}${imageName}`}
                                        alt={`Activity Image ${index}`}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(imageName)}
                                        style={{
                                            position: "absolute",
                                            top: "2px",
                                            right: "2px",
                                            background: "rgba(0, 0, 0, 0.6)",
                                            color: "red",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            lineHeight: "20px",
                                            textAlign: "center",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Row>
                )}
            </Modal >


            {/* loading */}
            {loading && <Loading />}

            {/* confirm delete */}
            <ConfirmDelete
                isOpen={isConfirm}
                onClose={() => setConfirm(false)}
                onConfirm={submitDeleteActivity}
            />
        </>
    );
};

export default Activities;
