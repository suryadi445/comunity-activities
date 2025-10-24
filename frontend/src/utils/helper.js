// ======================
// 🔹 FORM VALIDATION
// ======================

export const validateForm = (fields, rules) => {
    const errors = {};

    for (const [key, rule] of Object.entries(rules)) {
        const value = fields[key];

        // Rule: required
        if (rule.required && (!value || value === "")) {
            errors[key] = `${rule.label || key} is required`;
            continue;
        }

        // Rule: minLength
        if (rule.minLength && value?.length < rule.minLength) {
            errors[key] = `${rule.label || key} must be at least ${rule.minLength} characters`;
            continue;
        }

        // Rule: maxLength
        if (rule.maxLength && value?.length > rule.maxLength) {
            errors[key] = `${rule.label || key} must be less than ${rule.maxLength} characters`;
            continue;
        }

        // Rule: file validation (optional)
        if (rule.file && value) {
            const fileList = Array.isArray(value) ? value : [value];
            const { maxSize, allowedTypes } = rule.file;

            for (const file of fileList) {
                if (maxSize && file.size > maxSize) {
                    errors[key] = `${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(1)} MB`;
                    break;
                }

                if (allowedTypes && !allowedTypes.includes(file.type)) {
                    errors[key] = `${file.name} has invalid file type`;
                    break;
                }
            }
        }

        // Rule: custom validator
        if (rule.validate && typeof rule.validate === "function") {
            const customError = rule.validate(value);
            if (customError) errors[key] = customError;
        }
    }

    return errors;
};

// ======================
// 🔹 FILE VALIDATION
// ======================

export const validateFile = (file, options = {}) => {
    const { maxSize, allowedTypes } = options;

    if (!file) return "File is required";

    if (maxSize && file.size > maxSize) {
        return `File exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(1)} MB`;
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
        return `Invalid file type (${file.type})`;
    }

    return null; // valid
};

// ======================
// 🔹 STRING HELPERS
// ======================

export const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export const truncate = (str, maxLength = 50) =>
    str?.length > maxLength ? str.slice(0, maxLength) + "..." : str;

// ======================
// 🔹 DATE HELPERS
// ======================

export const formatDate = (date, locale = "id-ID") => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// ======================
// 🔹 OBJECT HELPERS
// ======================

export const isEmptyObject = (obj) =>
    !obj || Object.keys(obj).length === 0;

// ======================
// 🔹 RANDOM HELPERS
// ======================

export const randomString = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};
