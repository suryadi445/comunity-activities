import Row from "../../components/Row";
import InputLabel from "../../components/InputLabel";
import TextareaLabel from "../../components/TextareaLabel";
import DatepickerLabel from "../../components/DatepickerLabel";
import CardBox from "../../components/CardBox";
import Button from "../../components/Button";
import Tabs from "../../components/Tabs";
import Label from "../../components/Label";
import { FaHouseUser, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../../components/Toast";
import api from "../../config/axiosConfig";

const AppSettings = () => {

    const [form, setForm] = useState({
        id: null,
        apps_name: "",
        business_type: "",
        owner_name: "",
        established_year: "",
        business_license: "",
        tax_id: "",
        phone: "",
        email: "",
        operating_hours: "",
        social_media: [],
        address: "",
        user_name: "",
        user_email: "",
        user_phone: "",
        user_role: "",
        role_periode: "",
        joined_date: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get("/api/settings-apps");
            const data = response.data.response;
            if (data) {
                setForm({
                    id: data.id ?? null,
                    apps_name: data.apps_name ?? "",
                    business_type: data.business_type ?? "",
                    owner_name: data.owner_name ?? "",
                    established_year: data.established_year ?? "",
                    business_license: data.business_license ?? "",
                    tax_id: data.tax_id ?? "",
                    phone: data.phone ?? "",
                    email: data.email ?? "",
                    operating_hours: data.operating_hours ?? "",
                    social_media: Array.isArray(data.social_media) ? data.social_media : data.social_media ? [data.social_media] : [],
                    address: data.address ?? "",
                    user_name: data.user_name ?? "",
                    user_email: data.user_email ?? "",
                    user_phone: data.user_phone ?? "",
                    user_role: data.user_role ?? "",
                    role_periode: data.role_periode ?? "",
                    joined_date: data.joined_date ?? "",
                });
            }

        } catch (error) {
            toastError(error);
        }
    }

    const handleChange = (e) => {
        if (e instanceof Date) { // for input Date
            const y = e.getFullYear();
            const m = String(e.getMonth() + 1).padStart(2, "0");
            const d = String(e.getDate()).padStart(2, "0");
            const formatted = `${y}-${m}-${d}`;

            setForm((prev) => ({
                ...prev,
                joined_date: formatted,
            }));
            return;
        }

        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }))
    };

    const handleSubmitProfileApps = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put("/api/settings-apps", form);

            if (response.status === 200) {
                toastSuccess("Update Successfully");
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleSocialMediaChange = (value, index) => {
        const updated = [...form.social_media];
        updated[index] = value;

        setForm((prevForm) => ({
            ...prevForm,
            social_media: updated,
        }));
    };

    const addSocialMedia = () => {
        setForm((prevForm) => ({
            ...prevForm,
            social_media: [...prevForm.social_media, ""],
        }));
    };

    const removeSocialMedia = (index) => {
        const updated = form.social_media.filter((_, i) => i !== index);

        setForm((prevForm) => ({
            ...prevForm,
            social_media: updated,
        }));
    };


    const tabs = [
        {
            key: "profile",
            title: (
                <div className="flex items-center">
                    <FaHouseUser className="mr-2" />
                    Profile Apps
                </div>
            ),
            content: (
                <>
                    <form onSubmit={handleSubmitProfileApps}>
                        <Row cols={2}>
                            <InputLabel
                                label="Apps Name"
                                prop="apps_name"
                                value={form.apps_name}
                                onChange={handleChange}
                                placeholder="Enter app name"
                            />
                            <InputLabel
                                label="Business Type"
                                prop="business_type"
                                value={form.business_type}
                                onChange={handleChange}
                                placeholder="Enter business type (e.g. Workshop, School)"
                            />
                            <InputLabel
                                label="Owner Name"
                                prop="owner_name"
                                value={form.owner_name}
                                onChange={handleChange}
                                placeholder="Enter owner's name"
                            />
                            <InputLabel
                                label="Established Year"
                                prop="established_year"
                                value={form.established_year}
                                onChange={handleChange}
                                placeholder="Enter year of establishment"
                            />
                            <InputLabel
                                label="Business License Number"
                                prop="business_license"
                                value={form.business_license}
                                onChange={handleChange}
                                placeholder="Enter license number"
                            />
                            <InputLabel
                                label="Tax ID (NPWP)"
                                prop="tax_id"
                                value={form.tax_id}
                                onChange={handleChange}
                                placeholder="Enter tax ID number"
                            />
                            <InputLabel
                                label="Phone Number"
                                prop="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                            <InputLabel
                                label="Email"
                                prop="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />
                            <InputLabel
                                label="Operating Hours"
                                prop="operating_hours"
                                value={form.operating_hours}
                                onChange={handleChange}
                                placeholder="Enter business hours"
                            />

                            <div className={`grid grid-cols-1 sm:grid-cols-2`}>
                                <Label label="Social Media" />
                                <div className="col-span-2">
                                    <Button
                                        type="button"
                                        onClick={addSocialMedia}
                                        className="text-blue-500 text-sm"
                                    >
                                        + Add Social Media
                                    </Button>
                                </div>
                            </div>

                            {form.social_media.map((sm, index) => (
                                <div key={index} >
                                    <InputLabel
                                        label={`Social Media ${index + 1}`}
                                        prop={`social_media_${index}`}
                                        type="text"
                                        name={`social_media_${index}`}
                                        value={sm}
                                        onChange={(e) => handleSocialMediaChange(e.target.value, index)}
                                        placeholder="https://instagram.com/yourbiz"
                                    />
                                    {index == 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSocialMedia(index)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </Row>

                        <Row className="mt-2">
                            <TextareaLabel
                                label="Address"
                                prop="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter full address"
                            />
                        </Row>

                        <div className="mt-3">
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </>
            ),
        },
        {
            key: "user",
            title: (
                <div className="flex items-center">
                    <FaUser className="mr-2" />
                    User Profile
                </div>
            ),
            content: (
                <>
                    <form onSubmit={handleSubmitProfileApps}>
                        <Row cols={2} >
                            <InputLabel
                                label="Full Name"
                                prop="user_name"
                                value={form.user_name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />

                            <DatepickerLabel
                                label="Joined Date"
                                prop="joined_date"
                                value={form.joined_date || ""}
                                onChange={handleChange}
                            />

                            <InputLabel
                                label="Email"
                                prop="user_email"
                                type="email"
                                value={form.user_email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />
                            <InputLabel
                                label="Phone Number"
                                prop="user_phone"
                                value={form.user_phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                            <InputLabel
                                label="Role"
                                prop="user_role"
                                value={form.user_role}
                                onChange={handleChange}
                                placeholder="Enter user role"
                            />
                            <InputLabel
                                label="Role Period"
                                prop="role_periode"
                                value={form.role_periode}
                                onChange={handleChange}
                                placeholder="Enter role period"
                            />

                            <div className="mt-3">
                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </Row>
                    </form>
                </>
            ),
        },
    ];

    return (
        <div>
            <main>
                <Row>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Settings</h1>
                    </div>
                </Row>

                <CardBox>
                    <Tabs tabs={tabs} />
                </CardBox>
            </main>
        </div>
    );
};

export default AppSettings;
