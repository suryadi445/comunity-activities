import { FaPen } from "react-icons/fa";

export default function EditButton({ sectionKey, openModal, data }) {
    return (
        <section
            className="relative bg-transparent font-sans"
            onClick={() => openModal(sectionKey, data)}
        >
            <div className="container mx-auto px-6 py-8 relative">
                <div className="absolute bottom-4 right-0 cursor-pointer p-3 rounded-full font-semibold text-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-800 dark:focus:ring-indigo-900 transition-all duration-300 ease-in-out">
                    <FaPen size={18} className="text-white" />
                </div>
            </div>
        </section>
    );
}

