import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import axios from "axios";
import Modal from "../../components/Modal";
import Row from "../../components/Row";
import InputLabel from "../../components/InputLabel";
import TextareaLabel from "../../components/TextareaLabel";
import SelectLabel from "../../components/SelectLabel";
import EditButton from "../../components/EditButton";
import formatRupiah from "../../utils/formatRupiah";
import * as HiIcons from "react-icons/hi";
import { FaWhatsapp, FaEnvelope, FaTrash } from "react-icons/fa";
import { toastError, toastSuccess } from "../../components/Toast";
import { Link } from "react-router-dom";
import 'react-virtualized/styles.css';

export default function Landing() {
    // modal state
    const [modalType, setModalType] = useState(null);
    const [modalTitle, setModalTitle] = useState('');


    // landing / main state
    const [landingData, setLandingData] = useState('');


    // slideshow state
    const [current, setCurrent] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModalSlideshow, setShowModalSlideshow] = useState(false);
    const [imageSlideshow, setImageSlideshow] = useState('');
    const [titleSlideshow, setTitleSlideshow] = useState('');
    const [headerSlideshow, setHeaderSlideshow] = useState('');
    const [imageNumberSlideshow, setImageNumberSlideshow] = useState('');
    const imageNumberOptions = [
        { value: "1", label: "Image 1" },
        { value: "2", label: "Image 2" },
        { value: "3", label: "Image 3" },
        { value: "4", label: "Image 4" },
        { value: "5", label: "Image 5" },
    ];


    // Transaction state
    const [transactionData, setTransactionData] = useState([]);
    const [cashBalance, setCashBalance] = useState('')
    const [descriptionTransaction, setDescriptionTransaction] = useState('')
    const [showModalTransaction, setShowModalTransaction] = useState(false);


    // activity state
    const [activityList, setActivityList] = useState([]);
    const [activityTitle, setActivityTitle] = useState('')
    const [activityImages, setActivityImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalImageOpen, setIsModalImageOpen] = useState(false);
    const [imagePage, setImagePage] = useState(1);
    const imagesPerPage = 9;
    const totalImagePages = Math.ceil(activityImages.length / imagesPerPage);
    const startIndexImage = (imagePage - 1) * imagesPerPage;
    const endIndexImage = startIndexImage + imagesPerPage;
    const paginatedActivityImages = activityImages.slice(startIndexImage, endIndexImage);


    // announcement state
    const [announcements, setAnnouncements] = useState([]);
    const [time, setTime] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [countdown, setCountdown] = useState("");
    const [nextPrayer, setNextPrayer] = useState(null);
    const [announcementPage, setAnnouncementPage] = useState(1);
    const [totalAnnouncementPages, setTotalAnnouncementPages] = useState(1);


    // about us
    const [principles, setPrinciples] = useState([]);
    const [visionMission, setVisionMission] = useState('');
    const [quoteAboutUs, setQuoteAboutUs] = useState('')
    const [showModalAboutUs, setShowModalAboutUs] = useState(false);


    //  Structure Organitation
    const [showModalStructure, setShowModalStructure] = useState(false);
    const [leaderTitle, setLeaderTitle] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [leaderPhone, setLeaderPhone] = useState('');
    const [leaderImage, setLeaderImage] = useState('');
    const [assistants, setAssistants] = useState([
        { assistant: "", assistant_name: "", assistant_phone: "", assistant_image: "" }
    ]);


    // footer
    const [footerLatitude, setFooterLatitude] = useState('')
    const [footerLongitude, setFooterLongitude] = useState('')
    const [footerFooter, setFooterFooter] = useState('')
    const [showModalFooter, setShowModalFooter] = useState('');
    const [address, setAddress] = useState([]);


    // Feedback
    const [message, setMessage] = useState('');

    // fetch landing page data
    const fetchLandingData = async () => {
        try {
            const response = await api.get("/api/landing-page");
            setLandingData(response.data.response);
        } catch (error) {
            toast.error(error);
        }
    };


    /*
        SLIDESHOW
    */
    // handle previous slideshow
    const handlePrevious = () => {
        if (currentPage > 1) {
            fetchTransactionData(currentPage - 1);
        }
    };

    // handle next slideshow
    const handleNext = () => {
        if (currentPage < totalPages) {
            fetchTransactionData(currentPage + 1);
        }
    };

    // slideshow action
    const handleUpdateSlideshow = async () => {
        if (!imageNumberSlideshow || !headerSlideshow || !titleSlideshow) {
            toastError("Please fill in all required fields.");
            return false;
        }

        try {
            const formData = new FormData();
            formData.append("type", modalType);
            formData.append("imageNumber", imageNumberSlideshow);
            formData.append("header", headerSlideshow);
            formData.append("title", titleSlideshow);

            if (imageSlideshow) {
                const imageFile = document.querySelector('input[type="file"]').files[0];
                formData.append("image", imageFile);
            }

            const response = await api.put("/api/landing-page", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toastSuccess("Update Slideshow Successfully");
                setShowModalSlideshow(false);
                fetchLandingData();
            }
        } catch (error) {
            toastError(error);
        }
    };


    /*
    ANNOUNCEMENT
    */
    // annoncement time
    const secondDeg = time.getSeconds() * 6;
    const minuteDeg = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 + time.getSeconds() * (0.5 / 60);

    // fetch announcement with pagination
    const fetchAnnouncements = async (page = 1) => {
        try {
            const response = await api.get(`/api/announcement?page=${page}&limit=3`);

            if (response.data.response.data && response.data.response.data.length > 0) {
                setAnnouncements(response.data.response.data);
                setTotalAnnouncementPages(response.data.response.last_page);
                setAnnouncementPage(page);
            } else {
                // Fallback jika API kosong
                let defaultAnnouncementList = [];

                if (landingData?.default) {
                    try {
                        const parsed = JSON.parse(landingData.default[0].description);
                        defaultAnnouncementList = parsed.announcements || [];
                    } catch (err) {
                        toast.error("Gagal parse data default announcement: " + err.message);
                    }
                }

                // Hitung total halaman berdasarkan limit 3
                const limit = 3;
                const totalPages = Math.ceil(defaultAnnouncementList.length / limit);

                // Potong data sesuai halaman
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedDefault = defaultAnnouncementList.slice(start, end);

                // Format data final agar sesuai struktur di looping
                const finalAnnouncements = paginatedDefault.map((item, index) => ({
                    id: item.id ?? index,
                    title: item.title || "Tanpa Judul",
                    category: item.category || "Umum",
                    content: item.content || "Tidak ada isi pengumuman.",
                    start_date: item.start_date || new Date().toISOString(),
                    start_time: item.start_time || "",
                    end_date: item.end_date || "",
                    end_time: item.end_time || "",
                    is_active: item.is_active ?? true,
                    is_current: item.is_current ?? false,
                }));

                setAnnouncements(finalAnnouncements);
                setTotalAnnouncementPages(totalPages || 1);
                setAnnouncementPage(page);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
            toast.error("Gagal mengambil data pengumuman");
        }
    };


    // Announcement handlers
    const handlePrevAnnouncement = () => {
        if (announcementPage > 1) {
            fetchAnnouncements(announcementPage - 1);
        }
    };

    const handleNextAnnouncement = () => {
        if (announcementPage < totalAnnouncementPages) {
            fetchAnnouncements(announcementPage + 1);
        }
    };


    /*
        ABOUT US
    */
    // About us action
    const handleUpdateAboutUs = async () => {
        const payload = {
            type: modalType,
            vision_mission: visionMission,
            description: quoteAboutUs,
            principles: principles,
        };

        try {
            const response = await api.put("/api/landing-page", payload);

            if (response.status === 200) {
                toastSuccess("Update About Us Successfully");
                setShowModalAboutUs(false);
                fetchLandingData();
            }
        } catch (error) {
            toastError("Failed to update About Us");
        }
    };


    /*
        ACTIVITY
    */
    // fetch activity data
    const fetchActivityData = async () => {
        const response = await api.get("/api/activities?page=1&limit=10");

        if (response.data.response.data && response.data.response.data.length > 0) {
            setActivityList(response.data.response.data);
        } else {
            // default value
            let defaultActivityList = [];
            if (landingData.default) {
                try {
                    const parsed = JSON.parse(landingData.default[0].description);
                    defaultActivityList = parsed.defaultActivityList || [];
                } catch (err) {
                    toast.error(err);
                }
            }

            const finalActivity = defaultActivityList.map((item, index) => ({
                id: item.id ?? index,
                title: item.title,
                activity_date: item.activity_date,
                time: item.time,
                location: item.location,
            }));

            setActivityList(finalActivity);
        }
    };

    // fetch activity photo
    const fetchActivityImages = async () => {
        const response = await api.get(`/api/images-activity`);
        if (response.data.response.data && response.data.response.data.length > 0) {
            const resDataArray = response.data?.response?.data || [];

            const allImages = resDataArray.flatMap(item => {
                const path = item.path || "";
                const images = Array.isArray(item.images) ? item.images : [];
                return images.map(img => path + img);
            });

            const limitedImages = allImages.slice(0, 12);

            setActivityImages(limitedImages);
            setImagePage(1);
        } else {
            // Fallback if API response is empty
            if (landingData) {
                try {
                    const parsed = JSON.parse(landingData.default[0].description);
                    const gallery = parsed.galleryImages || [];
                    setActivityImages(gallery);
                } catch {
                    setActivityImages([]);
                }
            }
        }
    };

    // activity event on click
    const handleActivityClick = async (id, title) => {
        try {
            const response = await api.get(`/api/images-activity-by-id?id=${id}`);
            const resDataArray = response.data?.response || [];

            if (resDataArray.length > 0) {
                setActivityTitle(response.data?.response[0].title)
                const { path = "", images = [] } = resDataArray[0];
                const fullImages = images.map(img => path + img);
                setActivityImages(fullImages);
            } else {
                setActivityTitle(title)
                setActivityImages([]);
            }
        } catch (error) {
            console.error("Gagal ambil foto:", error);
        }
    };

    // handle prev activity image
    const handlePrevImagePage = () => {
        setImagePage(prev => (prev > 1 ? prev - 1 : 1));
    };

    // handle next activity image
    const handleNextImagePage = () => {
        setImagePage(prev => (prev < totalImagePages ? prev + 1 : totalImagePages));
    };

    const openModalImage = (img, idx) => {
        setSelectedImage(img);
        setIsModalImageOpen(true);
    }


    /*
        TRANSACTION
    */
    // fetch transaction
    const fetchTransactionData = async (page = 1) => {

        const response = await api.get(`/api/cash-reports?page=${page}&limit=5`);
        const responseCB = await api.get(`/api/cash-balance?type=&date=`);

        if (response.data.response.data && response.data.response.data.length > 0) {
            const { data, last_page } = response.data.response;
            setTransactionData(data);
            setTotalPages(last_page);
            setCurrentPage(page);

            if (responseCB.data.response) {
                const { total_amount } = responseCB.data.response;
                setCashBalance(total_amount)
            } else {
                setCashBalance(55000)
            }
        } else {
            // Fallback if API response is empty
            if (landingData) {
                try {
                    const parsed = JSON.parse(landingData.default[0].description);
                    const defaultTransactions = parsed.transactionData || [];

                    const totalDefaultPages = Math.ceil(defaultTransactions.length / 5);
                    const startIndex = (page - 1) * 5;
                    const endIndex = startIndex + 5;
                    const paginatedData = defaultTransactions.slice(startIndex, endIndex);

                    setTransactionData(paginatedData);
                    setTotalPages(totalDefaultPages);
                    setCurrentPage(page);
                } catch (parseError) {
                    setTransactionData([]);
                    setTotalPages(1);
                    setCurrentPage(1);
                }
            }
            setCashBalance(55000)
        }


    };

    // update transaction
    const handleUpdateTransaction = async () => {
        const payload = {
            type: modalType,
            description: descriptionTransaction,
        };

        try {
            const response = await api.put("/api/landing-page", payload);

            if (response.status === 200) {
                toastSuccess("Update Description of Transaction Successfully");
                setShowModalTransaction(false);
                fetchLandingData();
            }
        } catch (error) {
            toastError("Failed to update Description of Transaction");
        }
    };


    /*
        STRUCTURE ORGANITATION
    */
    // update structure organization
    const handleUpdateStructure = async () => {

        if (!leaderTitle || !leaderName || !leaderPhone) {
            toastError("Please fill in all required fields.");
            return false;
        }

        const formData = new FormData();

        formData.append("type", modalType);
        formData.append("leaderName", leaderName);
        formData.append("leaderPhone", leaderPhone);
        formData.append("leaderTitle", leaderTitle);

        if (leaderImage instanceof File) {
            formData.append("image", leaderImage);
        }

        assistants.forEach((assistant, index) => {
            formData.append(`assistant_title_${index}`, assistant.assistant_title);
            formData.append(`assistant_name_${index}`, assistant.assistant_name);
            formData.append(`assistant_phone_${index}`, assistant.assistant_phone);

            if (assistant.assistant_image instanceof File) {
                formData.append(`assistant_image_${index}`, assistant.assistant_image);
            }
        });

        try {
            const response = await api.put("/api/landing-page-structure", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toastSuccess("Update Structure Organization Successfully");
                setShowModalTransaction(false);
                fetchLandingData();
            }
        } catch (error) {
            toastError("Failed to update Structure Organization");
        }
    }

    //  add assistant
    const addAssistant = () => {
        setAssistants([
            ...assistants,
            { assistant: "", assistant_name: "", assistant_phone: "", assistant_image: "" }
        ]);
    };

    // remove assistant
    const removeAssistant = (index) => {
        setAssistants(assistants.filter((_, i) => i !== index));
    };

    // update assistant
    const handleAssistantChange = (index, field, value) => {
        const newAssistants = [...assistants];
        newAssistants[index][field] = value;
        setAssistants(newAssistants);
    };


    /*
        FOOTER
    */
    // fetch address
    const fetchAddress = async () => {
        const response = await api.get(`/api/settings-apps`);
        if (response.data.response) {
            if (response.data.response.address) {
                setAddress(response.data.response)
            } else {
                if (landingData) {
                    try {
                        const parsed = JSON.parse(landingData.default[0].description);
                        const address = parsed.address[0] || [];
                        setAddress(address);
                    } catch {
                        setAddress([]);
                    }
                }
            }
        } else {
            // Fallback if API response is empty, user from default value
            if (landingData) {
                try {
                    const parsed = JSON.parse(landingData.default[0].description);
                    const address = parsed.address[0] || [];
                    setAddress(address);
                } catch {
                    setAddress([]);
                }
            }
        }
    };

    // footer update action
    const handleUpdateFooter = async () => {

        if (!footerLatitude || !footerLongitude || !footerFooter) {
            toastError("Please fill in all required fields.");
            return false;
        }

        const payload = {
            type: modalType,
            latitude: footerLatitude,
            longitude: footerLongitude,
            footer: footerFooter,
        };

        try {
            const response = await api.put("/api/landing-page", payload);

            if (response.status === 200) {
                toastSuccess("Update Footer Successfully");
                setShowModalTransaction(false);
                fetchLandingData();
            }
        } catch (error) {
            toastError("Failed to update Footer");
        }
    }

    // feedback / critism and suggestions
    const handleFeedback = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/api/feedback", { message });

            if (response.status == 201) {
                toastSuccess("Feedback successfully submitted");
                setMessage('')
            }
        } catch (error) {
            if (error.status == 429) {
                toastError(error.response.data.response)
            } else {
                toastError("Feedback failed submitted");
            }
        }
    }


    /*
        ONCHANGE
    */
    const handleChange = (index, key, value) => {
        const updated = [...principles];
        updated[index][key] = value;
        setPrinciples(updated);
    };


    /*
        MODAL
    */
    const openModal = (type) => {
        setModalType(type);

        if (type === "slideshow") {
            setImageNumberSlideshow('');
            setHeaderSlideshow('');
            setTitleSlideshow('');
            setShowModalSlideshow(true);

        } else if (type === "about_us") {
            setModalTitle("Edit About Us");
            setShowModalAboutUs(true);

        } else if (type === "transaction") {
            setModalTitle("Edit Transaction");
            setShowModalTransaction(true)

        } else if (type === "structure") {
            setModalTitle("Edit Structure");
            setShowModalStructure(true)

        } else if (type === "footer") {
            setModalTitle("Edit Footer");
            setShowModalFooter(true)

        }
    };


    /*
        USE EFFECT
    */
    // fetch landing page data
    useEffect(() => {
        fetchLandingData();
    }, []);


    // set time announcement
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const position = await new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );

                const { latitude, longitude } = position.coords;
                const response = await axios.get(
                    `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
                );

                const timings = response.data?.data?.timings || {};
                const formatted = {
                    Subuh: timings.Fajr,
                    Dzuhur: timings.Dhuhr,
                    Ashar: timings.Asr,
                    Maghrib: timings.Maghrib,
                    Isya: timings.Isha,
                };

                setPrayerTimes(formatted);
            } catch (err) {
                console.error("Error mengambil jadwal salat:", err);
            }
        };

        fetchPrayerTimes();
    }, []);

    useEffect(() => {
        if (!prayerTimes) return;

        const updateCountdown = () => {
            const now = new Date();
            const today = now.toISOString().split("T")[0];

            const prayerEntries = Object.entries(prayerTimes)
                .filter(([_, time]) => !!time)
                .map(([name, time]) => {
                    const [hour, minute] = time.split(":").map(Number);
                    const prayerTime = new Date(`${today}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`);
                    return { name, time: prayerTime };
                });

            if (prayerEntries.length === 0) return;

            const next = prayerEntries.find((p) => p.time > now) || prayerEntries[0];
            setNextPrayer(next.name);

            const diff = next.time - now;
            const totalMinutes = Math.floor(diff / 60000);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const seconds = Math.floor((diff % 60000) / 1000);

            setCountdown(
                diff > 0
                    ? `${hours > 0 ? hours + " jam " : ""}${minutes} menit ${seconds} detik lagi`
                    : "Sedang waktu salat"
            );
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [prayerTimes]);

    // logic landing/main data
    useEffect(() => {
        if (landingData) {
            fetchActivityData();
            fetchActivityImages();
            fetchTransactionData();
            fetchAddress();
            fetchAnnouncements();

            try {
                // update vision Mission About us
                const dataVisionMission = landingData?.about_us?.[0]?.vision_mission;
                setVisionMission(dataVisionMission);
                // update principles
                const dataPrinciple = landingData?.about_us?.[0]?.principle;
                setPrinciples(dataPrinciple ? JSON.parse(dataPrinciple) : []);
                // update quote About Us
                const dataQuoteAboutUs = landingData?.about_us?.[0]?.description;
                setQuoteAboutUs(dataQuoteAboutUs);

                // Transaction
                const dataDescriptionTransaction = landingData?.transaction?.[0]?.description;
                setDescriptionTransaction(dataDescriptionTransaction)

                // structure organisation
                const dataLeaderStructure = landingData?.structure?.find((item) => item.leader_name);
                setLeaderName(dataLeaderStructure.leader_name)
                setLeaderPhone(dataLeaderStructure.leader_phone)
                setLeaderTitle(dataLeaderStructure.leader_title)
                setAssistants(
                    landingData.structure
                        ?.filter(a => a.assistant_title)
                        .map(a => ({
                            assistant_title: a.assistant_title || "",
                            assistant_name: a.assistant_name || "",
                            assistant_phone: a.assistant_phone || "",
                            image: a.image || "https://randomuser.me/api/portraits/men/32.jpg"
                        })) || []
                );

                // footer
                const dataFooterLatitude = landingData?.footer?.[0]?.latitude;
                setFooterLatitude(dataFooterLatitude)
                const dataFooterLongitude = landingData?.footer?.[0]?.longitude;
                setFooterLongitude(dataFooterLongitude)
                const dataFooterFooter = landingData?.footer?.[0]?.footer;
                setFooterFooter(dataFooterFooter)

            } catch {
                setVisionMission('')
                setPrinciples([]);
                setQuoteAboutUs('');
            }

            let interval;
            if (landingData.slideshow && landingData.slideshow.length > 0) {
                interval = setInterval(() => {
                    setCurrent((prev) => (prev + 1) % landingData.slideshow.length);
                }, 5000);
            }

            return () => {
                if (interval) clearInterval(interval);
            };
        }
    }, [landingData]);


    return (
        <>
            <main className="bg-gray-50 min-h-screen text-gray-900 font-sans">
                {/* Edit Button Slideshow */}
                <EditButton sectionKey="slideshow" openModal={openModal} />

                {/* HERO / SLIDESHOW */}
                <section className="relative w-full h-screen overflow-hidden select-none">
                    {landingData && landingData.slideshow && Array.isArray(landingData.slideshow) && landingData.slideshow.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        >
                            <img
                                src={slide.is_edit ? slide.path + slide.image : slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover brightness-75"
                            />
                            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center px-6 md:px-12">
                                <h1
                                    className="text-4xl md:text-6xl font-extrabold text-indigo-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
                                >
                                    {slide.header}
                                </h1>
                                <h1
                                    className="text-3xl md:text-2xl text-indigo-800 "
                                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
                                >
                                    {slide.title}
                                </h1>
                                <Link
                                    to="/register"
                                    className="mt-8 inline-block px-8 py-3 rounded-full font-semibold text-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-800 dark:focus:ring-indigo-900 transition-all duration-300 ease-in-out"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    ))}

                    {landingData && landingData.slideshow && Array.isArray(landingData.slideshow) && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
                            {landingData.slideshow.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={`w-5 h-5 rounded-full border-2 border-indigo-400 ${index === current ? "bg-indigo-400" : "bg-transparent"} transition-all`}
                                    aria-label={`Slide ${index + 1}`}
                                    aria-current={index === current}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Edit Button about us */}
                <EditButton sectionKey="about_us" openModal={openModal} />

                {/* Announcement */}
                <section className="bg-gray-50 mb-5">
                    <div className="flex justify-center items-center mb-10">
                        <h2 className="text-4xl font-extrabold text-center text-indigo-700 tracking-wide inline-block relative pb-2">
                            Pengumuman
                        </h2>
                    </div>
                    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 container mx-auto px-6 gap-8">
                        <div className="lg:w-1/2 w-full text-center">

                            <div className="overflow-hidden whitespace-nowrap w-80 mt-4">
                                <p className="animate-marquee text-indigo-700 font-semibold flex items-center space-x-6">
                                    <span className="text-gray-800 font-bold">
                                        📅 {time.toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </p>
                            </div>

                            <div className="overflow-hidden whitespace-nowrap w-80 mt-4">
                                <p className="animate-marquee text-indigo-700 font-semibold flex items-center space-x-6">
                                    <span className="text-gray-500 font-medium">
                                        🕌 {new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }).format(time)}
                                    </span>
                                </p>
                            </div>

                            <div className="relative mt-8 w-64 h-64 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-2xl flex items-center justify-center border-8 border-gray-300 mx-auto">
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i + 1) * 30;
                                    const x = 50 + 40 * Math.sin((angle * Math.PI) / 180);
                                    const y = 50 - 40 * Math.cos((angle * Math.PI) / 180);
                                    return (
                                        <span
                                            key={i}
                                            className="absolute text-sm font-bold text-gray-100"
                                            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                                        >
                                            {i + 1}
                                        </span>
                                    );
                                })}

                                {/* second */}
                                <div
                                    className="absolute w-1 h-28 bg-red-500 origin-bottom"
                                    style={{ transform: `rotate(${secondDeg}deg) translateY(-35%)` }}
                                ></div>

                                {/* minute */}
                                <div
                                    className="absolute w-1 h-28 bg-gray-700 rounded origin-center"
                                    style={{
                                        transform: `rotate(${minuteDeg}deg) translateY(-35%)`,
                                    }}
                                ></div>

                                {/* hour */}
                                <div
                                    className="absolute w-2 h-20 bg-gray-900 rounded origin-center"
                                    style={{
                                        transform: `rotate(${hourDeg}deg) translateY(-25%)`,
                                    }}
                                ></div>

                                <div className="w-5 h-5 bg-gray-900 rounded-full absolute shadow-md"></div>
                            </div>

                            <div className="mt-6 bg-white shadow-lg rounded-xl p-4">
                                <h4 className="text-center text-indigo-700 font-semibold mb-3">
                                    🕋 Jadwal Salat
                                </h4>

                                <ul className="text-gray-100 text-sm space-y-1">
                                    <>
                                        {prayerTimes && Object.keys(prayerTimes).length > 0 ? (
                                            <>
                                                {nextPrayer && (
                                                    <p className="text-center text-sm text-green-600 font-medium mb-3">
                                                        ⏳ {countdown} menuju <b>{nextPrayer}</b>
                                                    </p>
                                                )}
                                                <ul className="text-gray-100 text-sm space-y-1">
                                                    {Object.entries(prayerTimes).map(([name, time]) => (
                                                        <li
                                                            key={name}
                                                            className={`flex justify-between ${nextPrayer === name ? "text-indigo-700 font-bold" : ""
                                                                }`}
                                                        >
                                                            <span>{name}</span>
                                                            <span>{time}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        ) : (
                                            <p className="text-center text-gray-500 text-sm">Gagal memuat jadwal salat</p>
                                        )}
                                    </>

                                </ul>
                            </div>

                        </div>

                        <div className="lg:w-1/2 w-full">
                            {announcements.map((announcement, index) => (
                                <div
                                    key={index}
                                    className={`bg-white rounded-xl shadow-md p-6 ${!announcement.is_active
                                        ? 'border-l-4 border-red-500 opacity-50'
                                        : announcement.is_current
                                            ? 'border-l-4 border-green-500'
                                            : 'border-l-4 border-gray-300 opacity-75'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-semibold text-blue-600">
                                            {announcement.category}
                                        </span>
                                        {!announcement.is_active ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
                                                Nonaktif
                                            </span>
                                        ) : announcement.is_current ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">
                                                Kedaluwarsa
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mt-2">
                                        {announcement.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        <span className="font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                                            📅 Mulai :
                                        </span>{" "}
                                        {new Date(announcement.start_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })} ({announcement.start_time})
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        <span className="font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                                            📅 Berakhir :
                                        </span>{" "}
                                        {announcement.end_date && ` ${new Date(announcement.end_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}`}
                                        &nbsp;({announcement.end_time})
                                    </p>
                                    <p className="text-gray-100 mt-4 leading-relaxed">
                                        {announcement.content}
                                    </p>
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <div className="text-center text-gray-500">
                                    Tidak ada pengumuman saat ini.
                                </div>
                            )}

                            {/* Add pagination controls */}
                            {announcements.length > 0 && (
                                <div className="flex justify-center items-center space-x-4 mt-8">
                                    <button
                                        onClick={handlePrevAnnouncement}
                                        disabled={announcementPage === 1}
                                        className={`p-2 rounded-full transition-colors ${announcementPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                    >
                                        <HiIcons.HiChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-lg font-semibold text-gray-100">
                                        Page {announcementPage} of {totalAnnouncementPages}
                                    </span>
                                    <button
                                        onClick={handleNextAnnouncement}
                                        disabled={announcementPage === totalAnnouncementPages}
                                        className={`p-2 rounded-full transition-colors ${announcementPage === totalAnnouncementPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                    >
                                        <HiIcons.HiChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ABOUT US */}
                <section className="py-12 bg-gradient-to-b from-white to-indigo-50 font-sans">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-center items-center mb-10">
                            <h2 className="text-4xl font-extrabold text-center text-indigo-700 tracking-wide inline-block relative pb-2">
                                Tentang Kami
                            </h2>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                            <div className="lg:w-1/2 w-full text-center lg:text-left">
                                <h3 className="text-3xl font-bold mb-4 text-indigo-600 flex items-center justify-center lg:justify-start">
                                    Visi & Misi
                                </h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                    {landingData?.about_us?.[0]?.vision_mission}
                                </p>

                                <h3 className="text-3xl font-bold mb-4 text-indigo-600 flex items-center justify-center lg:justify-start">
                                    Prinsip & Komitmen Kami
                                </h3>
                                <ul className="space-y-4 text-gray-700 text-lg text-left inline-block lg:inline-block">
                                    {principles.map((item, index) => {
                                        const IconComponent = HiIcons[item.icon] || HiIcons.HiOutlineSparkles;
                                        return (
                                            <li key={index} className="flex items-start">
                                                <IconComponent
                                                    className={`h-6 w-6 ${item.color} mr-3 flex-shrink-0`}
                                                />
                                                <span>{item.text}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Right side (quote leader) */}
                            <div className="lg:w-1/2 w-full">
                                <div className="bg-indigo-50 rounded-xl p-8 shadow-inner relative overflow-hidden">
                                    <blockquote className="relative z-10">
                                        <p className="text-xl italic text-gray-800 leading-relaxed">
                                            "{landingData?.about_us?.[0]?.description}"
                                        </p>
                                        <footer className="mt-6 flex items-center justify-start">
                                            {landingData?.structure
                                                ?.filter(item => item.leader_name)
                                                .map((item, index) => (
                                                    <div key={index} className="flex items-center mr-6">
                                                        <img
                                                            src={item.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                                                            alt={item.leader_name || "Leader"}
                                                            className="w-16 h-16 rounded-full border-4 border-indigo-400 mr-5 object-cover"
                                                        />
                                                        <div>
                                                            <cite className="block font-semibold text-indigo-700 not-italic">
                                                                <h3 className="text-indigo-800 font-bold text-xl">
                                                                    {item.leader_name}
                                                                </h3>
                                                                <span className="text-sm text-gray-600">
                                                                    {item.leader_title}
                                                                </span>
                                                            </cite>
                                                        </div>
                                                    </div>
                                                ))}
                                        </footer>
                                    </blockquote>

                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GALLERY SECTION  */}
                <section className="py-12 bg-white font-sans">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-wide">
                            Galeri Kegiatan Warga
                        </h2>
                        <div className="flex flex-col lg:flex-row items-start gap-12">
                            {/* left side */}
                            <div className="lg:w-1/4 w-full">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-600">
                                    Daftar Kegiatan
                                </h3>
                                <ul className="space-y-4 text-gray-700 text-lg">
                                    {Array.isArray(activityList) && activityList.map((activity) => {
                                        const activityDate = new Date(activity.activity_date);
                                        const now = new Date();
                                        const isPastOrNow = activityDate <= now;

                                        return (
                                            <li key={activity.id} className="flex items-start">
                                                {isPastOrNow ? (
                                                    // Icon exclamation
                                                    <svg
                                                        className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.6c.75 1.334-.213 3.001-1.743 3.001H3.482c-1.53 0-2.493-1.667-1.743-3.001l6.518-11.6zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 112 0v4a1 1 0 01-1 1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                                    // Icon check
                                                    <svg
                                                        className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                                <span
                                                    className="cursor-pointer text-blue-500 hover:text-blue-600"
                                                    onClick={() => handleActivityClick(activity.id, activity.title)}
                                                >
                                                    {activity.title + " (" + activity.activity_date + ")"}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Right side */}
                            <div className="lg:w-3/4 w-full">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-600">
                                    Galeri Foto <span>{activityTitle}</span>
                                </h3>

                                {Array.isArray(paginatedActivityImages) && paginatedActivityImages.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                            {paginatedActivityImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => openModalImage(img, idx)}
                                                    className="overflow-hidden rounded-xl shadow-lg group cursor-pointer border-2 border-transparent hover:border-indigo-400 transition"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Galeri ${startIndexImage + idx + 1}`}
                                                        className="w-full h-44 object-cover transform group-hover:scale-110 transition duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {totalImagePages > 1 && (
                                            <div className="flex justify-center items-center space-x-4 mt-8">
                                                <button
                                                    onClick={handlePrevImagePage}
                                                    disabled={imagePage === 1}
                                                    className={`p-2 rounded-full transition-colors ${imagePage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                                >
                                                    <HiIcons.HiChevronLeft className="w-5 h-5" />
                                                </button>
                                                <span className="text-lg font-semibold text-gray-700">
                                                    Page {imagePage} of {totalImagePages}
                                                </span>
                                                <button
                                                    onClick={handleNextImagePage}
                                                    disabled={imagePage === totalImagePages}
                                                    className={`p-2 rounded-full transition-colors ${imagePage === totalImagePages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                                >
                                                    <HiIcons.HiChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-center text-gray-500 col-span-full">Tidak ada foto yang tersedia.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Edit Button Transaction */}
                <EditButton sectionKey="transaction" openModal={openModal} />

                {/* Transaction Report */}
                <section className="py-12 bg-gray-100 font-sans">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-wide">
                            Laporan Transaksi Kas
                        </h2>

                        <div className="flex flex-col lg:flex-row items-start gap-12">
                            {/* left side */}
                            <div className="lg:w-1/2 w-full">
                                <p className="text-gray-700 mb-6 text-lg">
                                    {landingData?.transaction?.[0]?.description}
                                </p>
                            </div>

                            {/* right side */}
                            <div className="lg:w-1/2 w-full">
                                <div className="text-center">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            <span className="text-sm uppercase">
                                                Saldo Akhir{" "}
                                            </span>
                                            <span className="animate-blink">
                                                {formatRupiah(cashBalance)}
                                            </span>
                                        </h2>
                                    </div>
                                </div>
                                <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto w-full max-w-5xl mx-auto">
                                        <table className="w-full min-w-full border-collapse">
                                            <thead className="bg-indigo-600 text-center">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                                                        Tanggal
                                                    </th>
                                                    <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                                                        Keterangan
                                                    </th>
                                                    <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                                                        Jumlah
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                                {transactionData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.date}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {item.description}
                                                        </td>
                                                        <td
                                                            className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.type === "in"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                                }`}
                                                        >
                                                            {formatRupiah(item.amount)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center space-x-4 mt-8">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-full transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                    >
                                        <HiIcons.HiChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-lg font-semibold text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-full transition-colors ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                    >
                                        <HiIcons.HiChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Event Schedule */}
                <section className="py-12 bg-gray-50 font-sans">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700 tracking-wide">
                            Jadwal Kegiatan Warga
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg border-separate border-spacing-0">
                                <thead className="bg-indigo-600 text-white text-lg">
                                    <tr>
                                        <th className="p-3 sm:p-4 text-left rounded-tl-lg">Tanggal</th>
                                        <th className="p-3 sm:p-4 text-left rounded-tl-lg">Jam</th>
                                        <th className="p-3 sm:p-4 text-left">Kegiatan</th>
                                        <th className="p-3 sm:p-4 text-left rounded-tr-lg">Lokasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(activityList) && activityList.map((activity) => {
                                        return (
                                            <tr key={activity.id} className="bg-indigo-50 hover:bg-indigo-100 transition">
                                                <td className="p-3 sm:p-4 font-semibold">{activity.activity_date}</td>
                                                <td className="p-3 sm:p-4">{activity.time}</td>
                                                <td className="p-3 sm:p-4">{activity.title}</td>
                                                <td className="p-3 sm:p-4">{activity.location}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot className="bg-white">
                                    <tr className="bg-white">
                                        <td colSpan="3" className="p-0 border-t-0"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Edit Button Structure */}
                <EditButton sectionKey="structure" openModal={openModal} />

                {/* Structure Organization */}
                <section className="py-12 bg-gray-100 font-sans">
                    <div className="container mx-auto px-4">
                        <h2 className="text-5xl font-extrabold mb-8 text-center text-indigo-800 tracking-wide">
                            Struktur Organisasi
                        </h2>
                        <div className="flex justify-center mb-10">
                            <div
                                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs text-center transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-indigo-300 border-b-4 border-indigo-500"
                            >
                                {landingData?.structure
                                    ?.filter(item => item.leader_name)
                                    .map((item, index) => (
                                        <div key={index} className="mb-8 text-center">
                                            <img
                                                src={item.image && item.image.includes("../..") ? item.image : item.path + item.image}
                                                alt={item.leader_name}
                                                className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500 mb-6 object-cover shadow-lg"
                                            />
                                            <h3 className="text-indigo-800 font-bold text-2xl mb-1">{item.leader_name}</h3>
                                            <p className="text-gray-600 text-lg">{item.leader_title}</p>
                                            <a
                                                href={`https://wa.me/${item.leader_phone.replace(/^0/, '62')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 text-lg hover:text-green-600 transition"
                                            >
                                                <FaWhatsapp size={18} className="inline-block mr-2" />
                                                {item.leader_phone}
                                            </a>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Container member */}
                        <div className="flex flex-wrap justify-center gap-12">
                            {landingData?.structure
                                ?.filter(item => item.assistant_name)
                                .map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs text-center transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-indigo-300 border-b-4 border-indigo-400"
                                    >
                                        <img
                                            src={item.image && item.image.includes("../..") ? item.image : item.path + item.image}
                                            alt={item.assistant_name}
                                            className="w-28 h-28 mx-auto rounded-full border-4 border-indigo-400 mb-6 object-cover shadow-md"
                                        />
                                        <h3 className="text-indigo-800 font-bold text-2xl mb-1">
                                            {item.assistant_name}
                                        </h3>
                                        <p className="text-gray-600 text-lg">
                                            {item.assistant_title}
                                        </p>
                                        <a
                                            href={`https://wa.me/${item.assistant_phone.replace(/^0/, '62')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 text-lg hover:text-green-600 transition"
                                        >
                                            <FaWhatsapp size={18} className="inline-block mr-2" />
                                            {item.assistant_phone}
                                        </a>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Edit Button Footer */}
                <EditButton sectionKey="footer" openModal={openModal} />

                {/* FOOTER */}
                <footer className="bg-gray-900 text-gray-400 pt-20 text-center">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 px-6">
                        {/* call us */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-full px-4">
                            <h3 className="text-2xl font-bold text-indigo-400 mb-6">Hubungi Kami</h3>
                            <ul className="space-y-3 mb-10">
                                <li>📍{address.address} </li>
                                <li>
                                    {address?.phone && (
                                        <a
                                            href={`https://wa.me/${address.phone.replace(/^0/, '62')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="cursor-pointer rounded-lg px-3 py-1 hover:bg-green-800 dark:hover:bg-green-800">
                                                <FaWhatsapp size={18} className="inline-block mr-2 text-green-600" />
                                                {address.phone}
                                            </span>
                                        </a>
                                    )}
                                </li>
                                <li>
                                    {address?.phone && (
                                        <a
                                            href={`mailto:${address.email}`}
                                        >
                                            <span className="cursor-pointer rounded-lg px-3 py-1 hover:bg-red-500 dark:hover:bg-red-800">
                                                <FaEnvelope size={18} className="inline-block mr-2 text-red-600" />
                                                {address.email}
                                            </span>
                                        </a>
                                    )}

                                </li>
                            </ul>

                            {landingData?.footer?.[0]?.latitude && landingData?.footer?.[0]?.longitude && (
                                <div className="w-full max-w-sm h-48 rounded-lg overflow-hidden shadow-md">
                                    <iframe
                                        title="Lokasi Kantor"
                                        src={`https://maps.google.com/maps?q=${landingData.footer[0].latitude},${landingData.footer[0].longitude}&z=15&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            )}
                        </div>

                        {/* Quote */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-full px-4 h-full justify-center">
                            <p className="text-lg italic text-green-600 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                                {landingData?.footer?.[0]?.description}
                            </p>
                        </div>


                        {/* Developer */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-full px-4">
                            <h3 className="text-2xl font-bold text-indigo-400 mb-6">Developer</h3>

                            <div className="relative inline-block group">
                                <img
                                    src="./images/suryadi.png"
                                    alt="Developer"
                                    className="w-28 h-28 rounded-full border-4 border-indigo-400 shadow-lg mx-auto transition-transform duration-300 group-hover:scale-105 group-hover:shadow-indigo-400"
                                />
                            </div>

                            <p className="mt-5 text-xl font-semibold text-indigo-300">Suryadi</p>
                            <p className="text-sm text-indigo-400 mb-6">Full Stack Developer</p>
                            <div className="flex justify-center md:justify-start gap-5 text-white">
                                {/* WhatsApp */}
                                <a
                                    href="https://wa.me/6289678468651"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 p-3 rounded-full cursor-pointer hover:bg-green-700 dark:hover:bg-green-600"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp size={18} />
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:suryadi.hhb@gmail.com"
                                    className="bg-red-500 p-3 rounded-full cursor-pointer hover:bg-red-700 dark:hover:bg-red-600"
                                    aria-label="Email"
                                >
                                    <FaEnvelope size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center mt-10 px-6">
                        <h3 className="text-2xl font-bold text-indigo-400 mb-6">Kritik & Saran</h3>
                        <form onSubmit={handleFeedback} className="flex flex-col gap-3 w-full max-w-md">
                            <textarea
                                placeholder="Tulis masukan Anda..."
                                rows="4"
                                className="p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg transition duration-300"
                                aria-label="Kirim Masukan"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-800 text-center text-gray-500 py-6 mt-10">
                        <p>&copy; {new Date().getFullYear()} {footerFooter} </p>
                    </div>
                </footer>
            </main >

            {/* modal */}
            < div >
                {/* modal slideshow */}
                < Modal size="max-w-xl" isOpen={showModalSlideshow} title={modalTitle} onClose={() => setShowModalSlideshow(false)
                } onAccept={handleUpdateSlideshow} >
                    <form>
                        <Row>
                            <SelectLabel
                                label="Image Number"
                                prop="number"
                                required
                                options={imageNumberOptions}
                                placeholder="Image Number"
                                value={imageNumberSlideshow}
                                onChange={(e) => setImageNumberSlideshow(e.target.value)}
                            />
                            <InputLabel
                                label="Header"
                                prop="header"
                                required
                                placeholder="Header"
                                value={headerSlideshow}
                                onChange={(e) => setHeaderSlideshow(e.target.value)}
                            />
                            <InputLabel
                                label="Title"
                                prop="title"
                                placeholder="Title"
                                required
                                value={titleSlideshow}
                                onChange={(e) => setTitleSlideshow(e.target.value)}
                            />
                            <InputLabel
                                type="file"
                                label="Image"
                                prop="image"
                                placeholder="Image"
                                value={imageSlideshow}
                                onChange={(e) => setImageSlideshow(e.target.value)}
                            />
                        </Row>
                    </form>
                </Modal >

                {/* modal about us */}
                < Modal size="max-w-xl" isOpen={showModalAboutUs} title={modalTitle} onClose={() => setShowModalAboutUs(false)} onAccept={handleUpdateAboutUs} >
                    <form>
                        <Row>
                            <TextareaLabel label="Visi & Misi" prop="visi_misi" required placeholder="Visi & Misi" value={visionMission} onChange={(e) => setVisionMission(e.target.value)} />
                        </Row>

                        <div className="space-y-4">
                            {principles.map((item, index) => (
                                <Row key={index}>
                                    <InputLabel
                                        label="Prinsip"
                                        prop={`prinsip_${index}`}
                                        required
                                        placeholder="Prinsip"
                                        value={item.text || ""}
                                        onChange={(e) => handleChange(index, "text", e.target.value)}
                                    />
                                </Row>
                            ))}
                        </div>

                        <Row className="mt-3">
                            <TextareaLabel label="Quote" prop="quote" required placeholder="Quote" value={quoteAboutUs} onChange={(e) => setQuoteAboutUs(e.target.value)} />
                        </Row>
                    </form>
                </Modal >

                {/* modal activity */}
                < Modal size="max-w-xl" isOpen={isModalImageOpen} title={modalTitle} modalFooter={false} onClose={() => setIsModalImageOpen(false)} >
                    {
                        selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={modalTitle}
                                className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                            />
                        ) : (
                            <p className="text-center text-gray-500">Tidak ada gambar untuk ditampilkan.</p>
                        )}
                </Modal >

                {/* modal transaction */}
                < Modal size="max-w-xl" isOpen={showModalTransaction} title={modalTitle} onClose={() => setShowModalTransaction(false)} onAccept={handleUpdateTransaction} >
                    <form>
                        <Row>
                            <TextareaLabel label="Description" prop="description" placeholder="Description" value={descriptionTransaction} onChange={(e) => setDescriptionTransaction(e.target.value)} />
                        </Row>
                    </form>
                </Modal >

                {/* modal structure organitation */}
                < Modal size="max-w-xl" isOpen={showModalStructure} title={modalTitle} onClose={() => setShowModalStructure(false)} onAccept={handleUpdateStructure} >
                    <form>
                        <Row>
                            <InputLabel label="Leader Title" prop="leader_title" required placeholder="Leader Title" value={leaderTitle} onChange={(e) => setLeaderTitle(e.target.value)} />
                            <InputLabel label="Leader Name" prop="leader_name" required placeholder="Leader Name" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} />
                            <InputLabel type="number" label="Phone Leader" prop="leader_phone" required placeholder="Phone Leader" value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} />
                            <InputLabel type="file" label="Leader Image" prop="leader_image" required placeholder="Leader Image" value={leaderImage} onChange={(e) => setLeaderImage(e.target.files[0])} />

                            <hr />

                            {assistants.map((assistant, index) => (
                                <div key={index} className="w-full border rounded-lg p-3 mb-3 relative">
                                    <h4 className="font-semibold text-indigo-600 mb-2">
                                        Assistant {index + 1}
                                    </h4>

                                    <InputLabel
                                        label="Assistant Title"
                                        prop={`assistant_${index}`}
                                        required
                                        placeholder="Assistant Title"
                                        value={assistant.assistant_title}
                                        onChange={(e) => handleAssistantChange(index, "assistant_title", e.target.value)}
                                    />
                                    <InputLabel
                                        label="Assistant Name"
                                        prop={`assistant_name_${index}`}
                                        required
                                        placeholder="Assistant Name"
                                        value={assistant.assistant_name}
                                        onChange={(e) => handleAssistantChange(index, "assistant_name", e.target.value)}
                                    />
                                    <InputLabel
                                        type="number"
                                        label="Phone Assistant"
                                        prop={`assistant_phone_${index}`}
                                        required
                                        placeholder="Phone Assistant"
                                        value={assistant.assistant_phone}
                                        onChange={(e) => handleAssistantChange(index, "assistant_phone", e.target.value)}
                                    />
                                    <InputLabel
                                        type="file"
                                        label="Assistant Image"
                                        prop={`assistant_image_${index}`}
                                        required
                                        placeholder="Assistant Image"
                                        value={assistant.assistant_image}
                                        onChange={(e) => handleAssistantChange(index, "assistant_image", e.target.files[0])}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeAssistant(index)}
                                        className="rounded-full text-sm w-8 h-8 absolute top-2 right-0 justify-center items-center inline-flex text-red-500 bg-transparent hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white"
                                    >
                                        <FaTrash className="w-3 h-3" />
                                        <span className="sr-only">
                                            Close
                                        </span>
                                    </button>
                                </div>
                            ))}

                            <button type="button" onClick={addAssistant} className="px-4 py-2 text-gray-300 rounded-lg shadow mt-2 bg-indigo-500 hover:text-white dark:hover:text-white">
                                + Add Assistant
                            </button>
                        </Row>
                    </form>
                </Modal >

                {/* modal footer */}
                < Modal size="max-w-xl" isOpen={showModalFooter} title={modalTitle} onClose={() => setShowModalFooter(false)} onAccept={handleUpdateFooter} >
                    <form>
                        <Row>
                            <InputLabel label="Latitude" prop="latitude" required placeholder="Latitude" value={footerLatitude} onChange={(e) => setFooterLatitude(e.target.value)} />
                            <InputLabel label="Longitude" prop="longitude" required placeholder="Longitude" value={footerLongitude} onChange={(e) => setFooterLongitude(e.target.value)} />
                            <InputLabel label="Footer" prop="footer" required placeholder="© 2025 Komunitas Warga. All rights reserved." value={footerFooter} onChange={(e) => setFooterFooter(e.target.value)} />
                        </Row>
                    </form>
                </Modal >
            </div >
        </>
    );
}