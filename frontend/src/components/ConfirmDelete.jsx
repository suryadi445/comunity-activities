import { useState } from "react";
import toast from "react-hot-toast";

const ConfirmDelete = ({ isOpen, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleCancel = () => {
        toast("Action cancelled", {
            icon: "⚠️",
        });
        onClose();
    };

    const handleConfirm = async () => {
        setIsDeleting(true);

        const loadingId = toast.loading("Preparing to delete...");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const promise = onConfirm();

        toast.promise(promise, {
            loading: "Deleting...",
            error: (err) =>
                err?.message || "Something went wrong during deletion",
        }, { id: loadingId });

        try {
            await promise;
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-5 w-full max-w-sm h-auto">
                <div className="relative p-6 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    {/* Close button */}
                    <button
                        type="button"
                        className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={handleCancel}
                        aria-label="Close modal"
                        disabled={isDeleting}
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    {/* Warning icon */}
                    <div className="flex justify-center items-center h-12">
                        <svg
                            className="w-10 h-10 fill-red-600 animate-pulse"
                            viewBox="0 0 448 512"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                    </div>

                    {/* Text */}
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6">
                        Are you sure?
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        This action
                        <span className="font-semibold text-red-600">
                            &nbsp;can't be undone
                        </span>.
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-center items-center space-x-4 mt-3">
                        <button
                            type="button"
                            className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            onClick={handleCancel}
                            disabled={isDeleting}
                        >
                            No, cancel
                        </button>
                        <button
                            type="button"
                            className={`py-2 px-3 text-sm font-medium text-white rounded-lg focus:ring-4 focus:outline-none ${isDeleting
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                }`}
                            onClick={handleConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Yes, I'm sure"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
