const Joi = require("joi");
const url = require("url");
const formidable = require("formidable");
const path = require('path');
const { validateFile, moveUploadedFile } = require("../utils/fileHandler");
const fs = require("fs");


const {
    getAllActivity,
    insertActivity,
    editActivity,
    deleteActivityById,
    getAllImagesActivity,
    insertImagesActivity,
    deleteImagesActivityByImage,
} = require("../models/activityModel.js");

const activitySchema = Joi.object({
    id: Joi.any().optional(),
    title: Joi.string().min(3).max(255).required().messages({
        "any.required": "Title is required.",
        "string.empty": "Title cannot be empty.",
        "string.min": "Title must be at least 3 characters long.",
        "string.max": "Title must not exceed 255 characters.",
    }),
    activity_date: Joi.date().iso().required().messages({
        "any.required": "Activity date is required.",
        "date.base": "Activity date must be a valid date.",
        "date.format": "Activity date must be in ISO format (YYYY-MM-DD).",
    }),
    description: Joi.string().allow(null, "").optional().messages({
        "string.base": "Description must be a string.",
    }),
    location: Joi.string().max(255).allow(null, "").optional().messages({
        "string.base": "Location must be a string.",
        "string.max": "Location must not exceed 255 characters.",
    }),
});

const getActivity = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const page = parseInt(parsedUrl.query.page) || 1;
    const limit = parseInt(parsedUrl.query.limit) || 10;
    const date = parsedUrl.query.date || "";

    try {
        const response = await getAllActivity(limit, page, date);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const createActivity = async (req, res) => {
    try {
        const { error, value } = activitySchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(err => err.message);
            return res.error(422, messages);
        }

        const { title, activity_date, description, location } = value;
        const created_by = req.user.id;

        const response = await insertActivity(title, activity_date, description, location, created_by);
        return res.success(201, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const updateActivity = async (req, res) => {
    try {
        const { error, value } = activitySchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(err => err.message);
            return res.error(422, messages);
        }

        const { id, title, activity_date, description, location } = value;

        const response = await editActivity(id, title, activity_date, description, location);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const deleteActivity = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id;

        const response = await deleteActivityById(id, userId);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const getImagesActivity = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const page = parseInt(parsedUrl.query.page) || 1;
    const limit = parseInt(parsedUrl.query.limit) || 10;

    try {
        const response = await getAllImagesActivity(limit, page);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const createImagesActivity = async (req, res) => {
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
        const activityId = getField(fields.activity_id);
        const uploadedBy = req.user?.id;

        if (!activityId) {
            return res.error(400, "Missing activity_id");
        }

        const images = Array.isArray(files["image[]"])
            ? files["image[]"]
            : [files["image[]"]];

        try {
            const uploadedFiles = [];
            const failedFiles = [];

            for (const file of images) {
                const validation = validateFile(file, "image");

                if (!validation.valid) {
                    failedFiles.push({
                        name: file.originalFilename,
                        error: validation.error,
                    });
                    continue;
                }

                const { newFileName } = moveUploadedFile(file, form.uploadDir);

                uploadedFiles.push({
                    name: newFileName,
                    original_name: file.originalFilename,
                });
            }

            // save to database
            if (uploadedFiles.length > 0) {
                try {
                    await insertImagesActivity(activityId, uploadedFiles, uploadedBy);
                } catch (err) {
                    console.error("Insert DB failed:", err);
                    failedFiles.push(...uploadedFiles.map(f => ({
                        name: f.original_name,
                        error: "DB error",
                    })));
                    uploadedFiles.length = 0;
                }
            }

            if (uploadedFiles.length === 0 && failedFiles.length > 0) {
                console.error("Failed to upload files:", failedFiles);
                return res.error(500, failedFiles[0].error);
            }

            if (uploadedFiles.length > 0 && failedFiles.length > 0) {
                console.error("Failed to upload files:", failedFiles);
                return res.success(207, {
                    message: "Failed to upload some files",
                    failed: failedFiles,
                });
            }

            return res.success(201, uploadedFiles);

        } catch (error) {
            console.error("Unexpected error", error);
            return res.error(500, "Unexpected error");
        }
    });
};

const deleteImagesActivity = async (req, res) => {
    try {
        const { image } = req.body;
        const response = await deleteImagesActivityByImage(image);

        if (response) {
            fs.unlinkSync(path.join(__dirname, "../uploads/images", image));
        }

        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

module.exports = {
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    getImagesActivity,
    createImagesActivity,
    deleteImagesActivity
};
