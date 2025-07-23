import toast from "react-hot-toast";

export const toastError = (error) => {
    const message = typeof error === "string" ? error : getErrorMessage(error);
    toast.error(message);
};

export const toastSuccess = (message) => {
    toast.success(message);
};

export const getErrorMessage = (error) => {
    const res = error?.response;

    if (res?.status === 422 && Array.isArray(res?.data?.response)) {
        return res.data.response.join("\n");
    }

    if (typeof res?.data?.response === "string") {
        return res.data.response;
    }

    if (res?.data?.message) {
        return res.data.message;
    }

    if (error?.request) {
        return "No response from server. Please check your network connection.";
    }

    if (error?.message) {
        return error.message;
    }

    return "An unexpected error occurred.";
};
