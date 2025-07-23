import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { Avatar } from "flowbite-react";
import CardBox from "../../components/CardBox";
import Button from "../../components/Button";
import DatepickerLabel from "../../components/DatepickerLabel";
import Row from "../../components/Row";
import InputLabel from "../../components/InputLabel";
import SelectLabel from "../../components/SelectLabel";
import TextareaLabel from "../../components/TextareaLabel";
import HR from "../../components/HR";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import { toastError, toastSuccess } from "../../components/Toast";
import { useUser } from '../../contexts/UserContext';


function UserProfile() {
    const initialFormState = {
        id: "",
        name: "",
        email: "",
        phone_number: "",
        title: "",
        gender: "",
        birthday: "",
        religion: "",
        marital_status: "",
        address: "",
        deskripsi: "",
        image: null,
        imageUrl: null,
        roles: [],
    };
    const [form, setForm] = useState(initialFormState);
    const [modalProfile, setModalProfile] = useState(false);
    const [prevImageUrl, setPrevImageUrl] = useState(null);
    const { user, setUser } = useUser();

    const handleChange = (e) => {
        if (e instanceof Date) { // for input Date
            const y = e.getFullYear();
            const m = String(e.getMonth() + 1).padStart(2, "0");
            const d = String(e.getDate()).padStart(2, "0");
            const formatted = `${y}-${m}-${d}`;

            setForm((prev) => ({
                ...prev,
                birthday: formatted,
            }));
            return;
        }

        const { name, type, value, files } = e.target;

        if (type === "file" && files?.[0]) { // for input file
            const file = files[0];
            setForm((prev) => ({
                ...prev,
                [name]: file,
                imageUrl: URL.createObjectURL(file),
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value || "",
            }));
        }
    };

    const handleModalProfile = async () => {
        setModalProfile(true)

        try {
            const response = await api.get("api/user");

            const imageUrl = response.data.response.image
                ? response.data.response.path + response.data.response.image
                : "../../../images/user.jpg";

            setForm({
                id: response.data.response.user_id,
                name: response.data.response.name,
                email: response.data.response.email,
                image: null,
                imageUrl: imageUrl,
                roles: response.data.response.roles.map(role => String(role.id))
            });

            setPrevImageUrl(imageUrl);
        } catch (error) {
            toastError(error);
        }
    }

    const handleSubmitProfileLeft = async () => {
        try {
            const formData = new FormData();
            formData.append("id", form.id);
            formData.append("name", form.name);
            formData.append("email", form.email);
            if (form.image) {
                formData.append("image", form.image);
            }

            form.roles.forEach((role) => {
                formData.append("roles", role);
            });

            const response = await api.put("/api/user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            setUser(response.data.response);

            toastSuccess("Update Successfully");

            await getProfile();
            setModalProfile(false);

        } catch (error) {
            setForm((prev) => ({
                ...prev,
                image: null,
                imageUrl: prevImageUrl,
            }));

            toastError(error);
        }

    }

    const getProfile = async () => {

        try {
            const imageUrl = user.image ? user.path + user.image : "../../../images/user.jpg";

            setForm(prev => ({
                ...prev,
                id: user.user_id || "",
                name: user.name || "",
                email: user.email || "",
                image: "",
                imageUrl: imageUrl || "",
                birthday: user.birthday || "",
                gender: user.gender || "",
                phone_number: user.phone_number || "",
                title: user.title || "",
                religion: user.religion || "",
                marital_status: user.marital_status || "",
                address: user.address || "",
                biography: user.biography || "",
            }));

        } catch (error) {
            toastError(error);
        }
    }

    const handleSubmitProfileRight = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put("/api/user/profile", {
                birthday: form.birthday,
                gender: form.gender,
                phone_number: form.phone_number,
                title: form.title,
            })

            toastSuccess("Update Successfully");

            setForm(prev => ({
                ...prev,
                birthday: response.data.response.birthday,
                gender: response.data.response.gender,
                phone_number: response.data.response.phone_number,
                title: response.data.response.title,
            }));
        } catch (error) {
            toastError(error);
        }
    }

    const handleSubmitProfileBottom = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put("/api/user/profile", {
                religion: form.religion,
                marital_status: form.marital_status,
                address: form.address,
                biography: form.biography
            })

            toastSuccess("Update Successfully");

            setForm(prev => ({
                ...prev,
                religion: response.data.response.religion,
                marital_status: response.data.response.marital_status,
                address: response.data.response.address,
                biography: response.data.response.biography
            }))
        } catch (error) {
            toastError(error);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <div>
            <main>
                <Row cols={2}>
                    {/* left side */}
                    <CardBox>
                        <Row>
                            <h1 className="text-xl font-bold text-dark dark:text-gray-700">
                                Profile Picture
                            </h1>

                            <div className="flex flex-wrap gap-4">
                                <Avatar img={form.imageUrl}
                                    alt="avatar" size="lg" rounded />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {form.name || ''}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {form.email || ''}
                                    </p>
                                </div>
                            </div>
                        </Row>

                        <HR />

                        <Row>
                            <Button className="w-fit mt-2" onClick={handleModalProfile} type="button">
                                <FontAwesomeIcon icon={faUserPen} className="text-lg text-white mr-2" />
                                Edit
                            </Button>
                        </Row>
                    </CardBox>

                    {/* right side */}
                    <CardBox>
                        <form onSubmit={handleSubmitProfileRight}>
                            <Row cols={2}>
                                <DatepickerLabel prop="birthday" label="Birthday" value={form.birthday || ""} onChange={handleChange} />

                                <SelectLabel
                                    label="Gender"
                                    prop="gender"
                                    required={true}
                                    options={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                    ]}
                                    value={form.gender || ""} onChange={handleChange}
                                />
                            </Row>


                            <Row cols="2" className="mt-2">
                                <InputLabel label="Phone Number" type="number" prop="phone_number" required={true} value={form.phone_number || ""} onChange={handleChange} />

                                <InputLabel label="Job Title" prop="title" value={form.title || ""} onChange={handleChange} />

                            </Row>

                            <Row className="mt-2">
                                <Button type="submit" className="w-fit">
                                    <FontAwesomeIcon icon={faFloppyDisk} className="text-xl text-white mr-2" />
                                    Save
                                </Button>
                            </Row>
                        </form>
                    </CardBox>
                </Row>

                {/* bottom side */}
                <Row className="mt-5">
                    <CardBox>
                        <form onSubmit={handleSubmitProfileBottom}>
                            <Row cols={2}>
                                <SelectLabel
                                    label="Religion"
                                    prop="religion"
                                    options={[
                                        { label: "Islam", value: "islam" },
                                        { label: "Kristen Protestan", value: "kristen_protestan" },
                                        { label: "Kristen Katolik", value: "katolik" },
                                        { label: "Hindu", value: "hindu" },
                                        { label: "Buddha", value: "buddha" },
                                        { label: "Konghucu", value: "konghucu" },
                                        { label: "Lainnya", value: "lainnya" },
                                    ]}
                                    value={form.religion || ""}
                                    onChange={handleChange}
                                />

                                <SelectLabel
                                    label="Marital Status"
                                    prop="marital_status"
                                    options={[
                                        { label: "Single", value: "single" },
                                        { label: "Married", value: "married" },
                                        { label: "Divorced", value: "divorced" },
                                        { label: "Widowed", value: "widowed" },
                                    ]}
                                    value={form.marital_status || ""}
                                    onChange={handleChange}
                                />
                            </Row>

                            <Row cols={2} className="mt-2">
                                <TextareaLabel
                                    label="Address"
                                    prop="address"
                                    placeholder="Enter your address"
                                    rows={5}
                                    value={form.address || ""}
                                    onChange={handleChange}
                                />

                                <TextareaLabel
                                    label="Biography"
                                    prop="biography"
                                    placeholder="Tell us about yourself"
                                    rows={5}
                                    value={form.biography || ""}
                                    onChange={handleChange}
                                />
                            </Row>

                            <Row className="mt-2">
                                <Button type="submit" className="w-fit">
                                    <FontAwesomeIcon icon={faFloppyDisk} className="text-xl text-white mr-2" />
                                    Save
                                </Button>
                            </Row>
                        </form>
                    </CardBox>
                </Row>
            </main>

            {/* modal */}
            <div>
                {/* modal profile */}
                <Modal
                    isOpen={modalProfile}
                    onClose={() => setModalProfile(false)}
                    title="Edit Profile"
                    onAccept={handleSubmitProfileLeft}
                >
                    <form>
                        <Row cols={2}>
                            <InputLabel label="Name" prop="name" required={true} onChange={handleChange} value={form.name} />

                            <InputLabel label="Email" prop="email" type="email" required={true} onChange={handleChange} value={form.email} />
                        </Row>

                        <Row cols={2} className="mt-3">
                            <InputLabel label="Image" prop="image" helpText="PNG, JPG or JPEG" type="file" required={true} onChange={handleChange} />
                        </Row>
                    </form>
                </Modal>
            </div>
        </div>
    )
}

export default UserProfile;