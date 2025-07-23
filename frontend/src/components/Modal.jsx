import { HiOutlineSave, HiOutlineX } from "react-icons/hi";
import Button from "./Button";

const Modal = ({
    isOpen,
    onClose,
    onAccept,
    onDecline,
    title = "",
    children,
    size = "max-w-4xl",
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className={`relative p-4 w-full ${size} max-h-full`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <HiOutlineX className="w-4 h-4" />
                            <span className="sr-only">
                                Close
                            </span>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 md:p-5 space-y-4 text-gray-700 dark:text-gray-400">
                        {children}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <div className="ml-auto flex gap-2">
                            <Button
                                icon={HiOutlineSave}
                                onClick={async () => {
                                    const result = await onAccept?.();
                                    if (result !== false) {
                                        onClose();
                                    }
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                icon={HiOutlineX}
                                color="light"
                                onClick={() => {
                                    onDecline?.();
                                    onClose();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Modal;
