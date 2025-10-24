// utils/fileHandler.js
const path = require("path");
const fs = require("fs");
const uuidv4 = require("uuid").v4;
const formidable = require("formidable");

// Allowed mimetypes
const allowedMimeTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"],
    document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
};

// Allowed extensions
const allowedExtensions = {
    image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    document: [".pdf", ".doc", ".docx"],
};

// Max file size in bytes
const maxSize = {
    image: 2 * 1024 * 1024, // 2 MB
    document: 3 * 1024 * 1024, // 3 MB
};

const isAllowedMime = (mimetype, type = "all") => {
    if (type === "image") return allowedMimeTypes.image.includes(mimetype);
    if (type === "document") return allowedMimeTypes.document.includes(mimetype);
    return (
        allowedMimeTypes.image.includes(mimetype) ||
        allowedMimeTypes.document.includes(mimetype)
    );
};

const isAllowedExtension = (filename, type = "all") => {
    const ext = path.extname(filename).toLowerCase();
    if (type === "image") return allowedExtensions.image.includes(ext);
    if (type === "document") return allowedExtensions.document.includes(ext);
    return (
        allowedExtensions.image.includes(ext) ||
        allowedExtensions.document.includes(ext)
    );
};

const isValidSize = (size, type = "all") => {
    if (type === "image") return size <= maxSize.image;
    if (type === "document") return size <= maxSize.document;
    return size <= Math.max(maxSize.image, maxSize.document);
};

// Main validator
/*
 * type = image or document
 */
const validateFile = (file, type = "all") => {
    if (!file) return { valid: false, error: "No file provided" };

    // Helper function to delete the file if it exists
    const deleteFileIfExists = (filepath) => {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    };

    // Validate mime type
    if (!isAllowedMime(file.mimetype, type)) {
        deleteFileIfExists(file.filepath);
        return { valid: false, error: "Invalid file type" };
    }

    // Validate file extension
    if (!isAllowedExtension(file.originalFilename || file.name, type)) {
        deleteFileIfExists(file.filepath);
        return { valid: false, error: "Invalid file extension" };
    }

    // Validate file size
    if (!isValidSize(file.size, type)) {
        deleteFileIfExists(file.filepath);
        return { valid: false, error: "File size too large" };
    }

    return { valid: true };
};

// Move and rename file
const moveUploadedFile = (file, targetDir, oldFile = null) => {
    const fileExtension = path.extname(file.originalFilename);
    const newFileName = `${Date.now()}-${uuidv4()}${fileExtension}`;
    const newPath = path.join(targetDir, newFileName);

    fs.renameSync(file.filepath, newPath);

    return {
        newFileName,
        newPath,
    };
};

const parseRequest = (req) => {
    return new Promise((resolve, reject) => {
        const contentType = req.headers["content-type"] || "";

        if (contentType.includes("application/json")) {
            // JSON
            try {
                const data = req.body;
                resolve({ fields: data, files: {} });
            } catch (err) {
                reject(err);
            }
        } else if (contentType.includes("multipart/form-data")) {
            // multipart
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, "../uploads/images");
            form.keepExtensions = true;

            if (!fs.existsSync(form.uploadDir)) {
                fs.mkdirSync(form.uploadDir, { recursive: true });
            }

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.log("error parse", err);
                    return res.error(500, "Form parsing error");
                }

                const getField = (field) => (Array.isArray(field) ? field[0] : field);
                const data = getField(fields);

                const imageFile = files.image;

                let imageName = null;
                if (imageFile) {
                    const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;

                    const { valid, error } = validateFile(file, "image");
                    if (!valid) {
                        return res.error(400, error);
                    }

                    // Move file
                    const result = moveUploadedFile(file, form.uploadDir);
                    if (!result) {
                        return res.error(500, "Failed to move file");
                    }

                    imageName = result.newFileName;
                }

                for (const key in data) {
                    if (Array.isArray(fields[key])) {
                        fields[key] = fields[key][0];
                    }
                }

                resolve({ fields, imageName });
            });
        } else {
            // fallback
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => resolve({ fields: { raw: body }, files: {} }));
        }
    });
};


module.exports = {
    validateFile,
    moveUploadedFile,
    parseRequest,
};
