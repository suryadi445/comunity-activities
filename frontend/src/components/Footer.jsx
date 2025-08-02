import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-white text-center p-3 shadow-md">
            <p className="text-sm flex items-center justify-center gap-4 flex-wrap">
                © 2025 - {new Date().getFullYear()} <a href="https://github.com/suryadi445" className="hover:text-blue-600 text-blue-500">Aniko Admin Panel</a> -

                <a
                    href="https://wa.me/6289678468651"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:underline"
                >
                    <FaWhatsapp size={20} />
                </a>

                <a
                    href="mailto:suryadi.hhb@gmail.com"
                    className="flex items-center gap-1 text-red-600 hover:underline"
                >
                    <FaEnvelope size={20} />
                </a>
            </p>
        </footer>
    );
}

export default Footer;
