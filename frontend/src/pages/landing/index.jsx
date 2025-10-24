import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import Modal from "../../components/Modal";
import InputLabel from "../../components/InputLabel";
import Row from "../../components/Row";
import TextareaLabel from "../../components/TextareaLabel";
import { HiOutlineSparkles, HiOutlineUserGroup, HiOutlineBriefcase, HiOutlineClock } from "react-icons/hi2";
import SelectLabel from "../../components/SelectLabel";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const slides = [
    {
        title: "Bersama Membangun Komunitas yang Kuat",
        description: "Menghubungkan warga, menggerakkan aksi, membangun masa depan.",
        image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "Gotong Royong untuk Semua",
        description: "Setiap tangan membantu, setiap hati peduli.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "Transparansi Adalah Kunci",
        description: "Keuangan warga yang terbuka dan terpercaya.",
        image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
];

const transactionData = [
    { date: '2023-08-01', description: 'Iuran Bulanan', amount: '+ Rp 50.000', type: 'in' },
    { date: '2023-08-05', description: 'Pembelian ATK', amount: '- Rp 25.000', type: 'out' },
    { date: '2023-08-10', description: 'Donasi Kegiatan', amount: '+ Rp 100.000', type: 'in' },
    { date: '2023-08-12', description: 'Pembayaran Listrik', amount: '- Rp 75.000', type: 'out' },
    { date: '2023-08-15', description: 'Sumbangan Kebersihan', amount: '+ Rp 20.000', type: 'in' },
    { date: '2023-08-18', description: 'Pembelian Sembako', amount: '- Rp 150.000', type: 'out' },
    { date: '2023-08-20', description: 'Iuran Wajib', amount: '+ Rp 50.000', type: 'in' },
    { date: '2023-08-22', description: 'Sewa Tenda', amount: '- Rp 120.000', type: 'out' },
    { date: '2023-08-25', description: 'Bantuan Sosial', amount: '+ Rp 25.000', type: 'in' },
    { date: '2023-08-28', description: 'Perbaikan Jalan', amount: '- Rp 200.000', type: 'out' },
];

const activityList = [
    "Kerja Bakti Bersama",
    "Rapat Rutin Bulanan",
    "Perayaan HUT Kemerdekaan",
    "Acara Silahturahmi Warga",
    "Donasi Bantuan Bencana",
];

const galleryImages = [
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function Landing() {
    const [current, setCurrent] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(transactionData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = transactionData.slice(startIndex, endIndex);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalAcceptHandler, setModalAcceptHandler] = useState(() => () => { });


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const iconOptions = [
        { value: 'slideshow', label: 'Slideshow' },
        { value: 'transaction', label: 'Transaction' },
        { value: 'structure', label: 'Structure' },
    ];

    const openModal = (type) => {
        setModalType(type);

        if (type === 'slideshow') {
            setModalTitle('Edit Slideshow');
            setModalContent(
                <Row>
                    <InputLabel label="Header" prop="header" required placeholder="Header" />
                    <InputLabel label="Title" prop="title" required placeholder="Title" />
                    <InputLabel type="file" label="Image" prop="image" required placeholder="Image" />
                </Row>
            );
            setModalAcceptHandler(() => handleUpdateSlideshow);
        } else if (type === 'transaction') {
            setModalTitle('Edit Transaction');
            setModalContent(
                <Row>
                    <TextareaLabel label="Description" prop="description" required placeholder="Description" />
                </Row>
            );
            setModalAcceptHandler(() => handleUpdateGallery);
        } else if (type === 'structure') {
            setModalTitle('Edit Structure');
            setModalContent(
                <Row>
                    <InputLabel label="Leader Title" prop="leader_title" required placeholder="Leader Title" />
                    <InputLabel label="Leader Name" prop="leader_name" required placeholder="Leader Name" />
                    <InputLabel type="number" label="Phone Leader" prop="leader_phone" required placeholder="Phone Leader" />
                    <InputLabel type="file" label="Leader Image" prop="leader_image" required placeholder="Leader Image" />

                    <hr />

                    <InputLabel label="Leader Assistant" prop="assistant" required placeholder="Leader Assistant" />
                    <InputLabel label="Asistant Name" prop="assistant_name" required placeholder="Asistant Name" />
                    <InputLabel type="number" label="Phone Assistant" prop="assistant_phone" required placeholder="Phone Assistant" />
                    <InputLabel type="file" label="Assistant Image" prop="assistant_image" required placeholder="Assistant Image" />
                </Row>
            );
            setModalAcceptHandler(() => handleUpdateStructure);
        } else if (type === 'footer') {
            setModalTitle('Edit Footer');
            setModalContent(
                <Row>
                    <InputLabel label="Latitude" prop="latitude" required placeholder="Latitude" />
                    <InputLabel label="Longitude" prop="longitude" required placeholder="Longitude" />
                    <InputLabel label="Footer" prop="footer" required placeholder="© 2025 Komunitas Warga. All rights reserved." />
                </Row>
            );
            setModalAcceptHandler(() => handleUpdateFooter);
        } else {
            setModalTitle('Edit About Us');
            setModalContent(
                <>
                    <Row>
                        <TextareaLabel label="Visi & Misi" prop="visi_misi" required placeholder="Visi & Misi" />
                    </Row>
                    <Row cols={2}>
                        <SelectLabel label="Icon" prop="icon" required options={iconOptions} />
                        <InputLabel label="Prinsip" prop="prinsip" required placeholder="Prinsip" />
                    </Row>
                    <Row>
                        <TextareaLabel label="Quote" prop="quote" required placeholder="Quote" />
                    </Row>
                </>
            );
            setModalAcceptHandler(() => handleUpdateSlideshow);
        }

        setShowModal(true);
    };

    const handleUpdateSlideshow = () => {
        // Handle slideshow update logic here
    };

    const handleUpdateGallery = () => {
        // Handle gallery update logic here
    };

    const handleUpdateStructure = () => {
        // Handle structure update logic here
    }

    const handleUpdateFooter = () => {
        // Handle footer update logic here
    }

    return (
        <>
            <main className="bg-gray-50 min-h-screen text-gray-900 font-sans">
                {/* HERO / SLIDESHOW */}
                <section className="relative w-full h-screen overflow-hidden select-none">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover brightness-75"
                            />
                            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center px-6 md:px-12">
                                <h1
                                    className="text-4xl md:text-6xl font-extrabold text-indigo-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
                                >
                                    {slide.title}
                                </h1>
                                <p className="mt-6 text-lg md:text-2xl max-w-3xl text-indigo-200 tracking-wide">
                                    {slide.description}
                                </p>
                                <button
                                    className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-transform duration-300"
                                    aria-label="Pelajari Lebih Lanjut"
                                >
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-5 h-5 rounded-full border-2 border-indigo-400 ${index === current ? "bg-indigo-400" : "bg-transparent"
                                    } transition-all`}
                                aria-label={`Slide ${index + 1}`}
                                aria-current={index === current}
                            />
                        ))}
                    </div>
                </section>

                {/* Edit Button Slideshow */}
                <section className="relative bg-gray-100 font-sans" onClick={() => openModal('slideshow')}>
                    <div className="container mx-auto px-6 py-8 relative">
                        <div className="absolute bottom-4 right-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded-full p-3 shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        >
                            <FaPen size={18} className="text-white" />
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
                            {/* Bagian Kiri: Deskripsi Singkat */}
                            <div className="lg:w-1/2 w-full text-center lg:text-left">
                                <h3 className="text-3xl font-bold mb-4 text-indigo-600 flex items-center justify-center lg:justify-start">
                                    Visi & Misi
                                </h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                    Kami berkomitmen membangun komunitas yang **kuat, transparan, dan aktif** dalam berbagai kegiatan sosial dan kemasyarakatan. Bersama-sama kami tumbuh dan berkontribusi untuk lingkungan yang lebih baik.
                                </p>

                                <h3 className="text-3xl font-bold mb-4 text-indigo-600 flex items-center justify-center lg:justify-start">
                                    Prinsip & Komitmen Kami
                                </h3>
                                <ul className="space-y-4 text-gray-700 text-lg text-left inline-block lg:inline-block">
                                    <li className="flex items-start">
                                        <HiOutlineSparkles className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                                        <span>Transparansi dan akuntabilitas</span>
                                    </li>
                                    <li className="flex items-start">
                                        <HiOutlineUserGroup className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <span>Kerjasama dan kebersamaan</span>
                                    </li>
                                    <li className="flex items-start">
                                        <HiOutlineBriefcase className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
                                        <span>Keberlanjutan lingkungan</span>
                                    </li>
                                    <li className="flex items-start">
                                        <HiOutlineClock className="h-6 w-6 text-teal-500 mr-3 flex-shrink-0" />
                                        <span>Keterbukaan dan inklusivitas</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Bagian Kanan: Kata Mutiara Pimpinan */}
                            <div className="lg:w-1/2 w-full">
                                <div className="bg-indigo-50 rounded-xl p-8 shadow-inner relative overflow-hidden">
                                    <blockquote className="relative z-10">
                                        <p className="text-xl italic text-gray-800 leading-relaxed">
                                            "Sebagai Pimpinan RW, saya sangat bersemangat melihat semangat gotong royong yang terus berkobar di komunitas kita. Mari kita terus bersinergi dan menjaga nilai-nilai kebersamaan demi masa depan yang lebih baik. Terima kasih atas dukungan dan partisipasi aktif seluruh warga."
                                        </p>
                                        <footer className="mt-6 flex items-center justify-start">
                                            <img
                                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                                alt="Budi Santoso"
                                                className="w-16 h-16 rounded-full border-4 border-indigo-400 mr-4 object-cover"
                                            />
                                            <div>
                                                <cite className="block font-semibold text-indigo-700 not-italic">
                                                    Budi Santoso
                                                </cite>
                                                <span className="text-sm text-gray-600">
                                                    Pimpinan RW 05
                                                </span>
                                            </div>
                                        </footer>
                                    </blockquote>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Edit Button Slideshow */}
                <section className="relative bg-white font-sans" onClick={() => openModal('about_us')} >
                    <div className="container mx-auto px-6 py-8 relative">
                        <div className="absolute bottom-4 right-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded-full p-3 shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                            <FaPen size={18} className="text-white" />
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

                            {/* Bagian Kiri: Daftar Kegiatan (1/4) */}
                            <div className="lg:w-1/4 w-full">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-600">
                                    Daftar Kegiatan
                                </h3>
                                <ul className="space-y-4 text-gray-700 text-lg">
                                    {activityList.map((activity, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>{activity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Bagian Kanan: Galeri Foto (3/4) */}
                            <div className="lg:w-3/4 w-full">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-600">
                                    Galeri Foto
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {galleryImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="overflow-hidden rounded-xl shadow-lg group cursor-pointer border-2 border-transparent hover:border-indigo-400 transition"
                                        >
                                            <img
                                                src={img}
                                                alt={`Galeri ${idx + 1}`}
                                                className="w-full h-44 object-cover transform group-hover:scale-110 transition duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Transaction Report */}
                <section className="py-12 bg-gray-100 font-sans">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-wide">
                            Laporan Transaksi Kas
                        </h2>
                        <div className="flex flex-col lg:flex-row items-start gap-12">
                            {/* Bagian Kiri: Teks dan Deskripsi */}
                            <div className="lg:w-1/2 w-full">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-600">
                                    Transparansi Keuangan
                                </h3>
                                <p className="text-gray-700 mb-6 text-lg">
                                    Laporan keuangan transparan dan akurat, dapat diakses oleh semua warga.
                                    Setiap pemasukan dan pengeluaran dicatat dengan detail.
                                </p>
                            </div>
                            {/* Bagian Kanan: Tabel Transaksi */}
                            <div className="lg:w-1/2 w-full bg-white shadow-xl rounded-2xl border border-gray-200">
                                <div className="overflow-x-auto w-full rounded overflow-hidden shadow-lg max-w-5xl mx-auto border border-gray-200">
                                    <table className="w-full min-w-full border-collapse">
                                        <thead className="bg-indigo-600 text-center">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                                                    Keterangan
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                                                    Jumlah
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 text-center">
                                            {currentItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {item.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination Controls */}
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-2xl border-t border-gray-200">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sebelumnya
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Berikutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Edit Button Transaction */}
                <section className="relative bg-white font-sans" onClick={() => openModal('transaction')}>
                    <div className="container mx-auto px-6 py-8 relative">
                        <div className="absolute bottom-4 right-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded-full p-3 shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                            <FaPen size={18} className="text-white" />
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
                                        <th className="p-3 sm:p-4 text-left">Kegiatan</th>
                                        <th className="p-3 sm:p-4 text-left rounded-tr-lg">Lokasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-indigo-50 hover:bg-indigo-100 transition">
                                        <td className="p-3 sm:p-4 font-semibold">12 Agustus 2025</td>
                                        <td className="p-3 sm:p-4">Kerja Bakti</td>
                                        <td className="p-3 sm:p-4">Lapangan RW</td>
                                    </tr>
                                    <tr className="bg-white hover:bg-indigo-50 transition">
                                        <td className="p-3 sm:p-4 font-semibold">20 Agustus 2025</td>
                                        <td className="p-3 sm:p-4">Rapat Bulanan</td>
                                        <td className="p-4 sm:p-4">Balai Warga</td>
                                    </tr>
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

                {/* Structure Organization */}
                <section className="py-12 bg-gray-100 font-sans">
                    <div className="container mx-auto px-4">
                        <h2 className="text-5xl font-extrabold mb-8 text-center text-indigo-800 tracking-wide">
                            Struktur Organisasi
                        </h2>
                        {/* Container Ketua RW */}
                        <div className="flex justify-center mb-10">
                            <div
                                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs text-center transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-indigo-300 border-b-4 border-indigo-500"
                            >
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Budi Santoso"
                                    className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500 mb-6 object-cover shadow-lg"
                                />
                                <h3 className="text-indigo-800 font-bold text-2xl mb-1">Budi Santoso</h3>
                                <p className="text-gray-600 text-lg">Ketua RW</p>
                            </div>
                        </div>

                        {/* Container Anggota */}
                        <div className="flex flex-wrap justify-center gap-12">
                            {/* Anggota 1 */}
                            <div
                                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs text-center transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-indigo-300 border-b-4 border-indigo-400"
                            >
                                <img
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                    alt="Siti Aminah"
                                    className="w-28 h-28 mx-auto rounded-full border-4 border-indigo-400 mb-6 object-cover shadow-md"
                                />
                                <h3 className="text-indigo-800 font-bold text-xl mb-1">Siti Aminah</h3>
                                <p className="text-gray-600 text-md">Sekretaris</p>
                            </div>

                            {/* Anggota 2 */}
                            <div
                                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs text-center transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-indigo-300 border-b-4 border-indigo-400"
                            >
                                <img
                                    src="https://randomuser.me/api/portraits/men/65.jpg"
                                    alt="Andi Prasetyo"
                                    className="w-28 h-28 mx-auto rounded-full border-4 border-indigo-400 mb-6 object-cover shadow-md"
                                />
                                <h3 className="text-indigo-800 font-bold text-xl mb-1">Andi Prasetyo</h3>
                                <p className="text-gray-600 text-md">Bendahara</p>
                            </div>

                            {/* Anggota 3 */}
                            <div
                                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs text-center transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-indigo-300 border-b-4 border-indigo-400"
                            >
                                <img
                                    src="https://randomuser.me/api/portraits/women/68.jpg"
                                    alt="Dewi Lestari"
                                    className="w-28 h-28 mx-auto rounded-full border-4 border-indigo-400 mb-6 object-cover shadow-md"
                                />
                                <h3 className="text-indigo-800 font-bold text-xl mb-1">Dewi Lestari</h3>
                                <p className="text-gray-600 text-md">Koordinator Kegiatan</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Edit Button Structure */}
                <section className="relative bg-white font-sans" onClick={() => openModal('structure')} >
                    <div className="container mx-auto px-6 py-8 relative">
                        <div className="absolute bottom-4 right-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded-full p-3 shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                            <FaPen size={18} className="text-white" />
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-gray-900 text-gray-400 pt-20 text-center">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 px-6">
                        {/* Hubungi Kami */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-full px-4">
                            <h3 className="text-2xl font-bold text-indigo-400 mb-6">Hubungi Kami</h3>
                            <ul className="space-y-3 mb-10 text-base">
                                <li>📍 Jl. Merpati No. 12, RW 05</li>
                                <li>📞 +62 812 3456 7890</li>
                                <li>✉️ info@warga.com</li>
                            </ul>

                            <div className="w-full max-w-sm h-48 rounded-lg overflow-hidden shadow-md">
                                <iframe
                                    title="Lokasi Kantor"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1234567890123!2d106.82715331531784!3d-6.175110495534759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3b4b0ed14c3%3A0xc7a8b56789abcdef!2sJl.%20Merpati%20No.%2012%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1691571300000!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-full px-4 h-full justify-center">
                            <p className="text-lg italic text-green-600 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                                “Jika anak Adam meninggal, terputuslah amalnya kecuali dari yang tiga; Sedekah jariyah, ilmu yang bermanfaat, atau anak saleh yang mendoakan.” (HR. Muslim, no. 1631)
                            </p>
                        </div>


                        {/* Developer */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-full px-4">
                            <h3 className="text-2xl font-bold text-indigo-400 mb-6">Developer</h3>

                            <div className="relative inline-block group">
                                <img
                                    src="https://randomuser.me/api/portraits/women/68.jpg"
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
                                    className="bg-green-600 p-3 rounded-full hover:bg-green-700 shadow-md hover:shadow-green-500/60 transition duration-300 ease-in-out"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp size={18} />
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:suryadi.hhb@gmail.com"
                                    className="bg-red-600 p-3 rounded-full hover:bg-red-700 shadow-md hover:shadow-red-500/60 transition duration-300 ease-in-out"
                                    aria-label="Email"
                                >
                                    <FaEnvelope size={18} />
                                </a>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col items-center justify-center mt-10 px-6">
                        <h3 className="text-2xl font-bold text-indigo-400 mb-6">Kritik & Saran</h3>
                        <form className="flex flex-col gap-3 w-full max-w-md">
                            <textarea
                                placeholder="Tulis masukan Anda..."
                                rows="4"
                                className="p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
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
                        <p>&copy; 2025 Komunitas Warga. All rights reserved.</p>
                    </div>
                </footer>

                {/* Edit Button Footer */}
                <section className="relative bg-white font-sans" onClick={() => openModal('footer')}>
                    <div className="container mx-auto px-6 py-8 relative">
                        <div className="absolute bottom-4 right-0 cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded-full p-3 shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                            <FaPen size={18} className="text-white" />
                        </div>
                    </div>
                </section>
            </main>

            {/* modal */}
            <div>
                <Modal size="max-w-xl" isOpen={showModal} onClose={() => setShowModal(false)} title={modalTitle} onAccept={modalAcceptHandler}>
                    {modalContent}
                </Modal>
            </div>
        </>
    );
}