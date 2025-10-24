const Joi = require("joi");
const url = require("url");
const {
    getAllAnnouncements,
    insertAnnouncement,
    editAnnouncementById,
    deleteAnnouncementById,
} = require("../models/AnnouncementModel");

const announcementSchema = Joi.object({
    id: Joi.any().optional(),
    category: Joi.string().max(100).required(),
    title: Joi.string().max(150).required(),
    content: Joi.string().required(),
    start_date: Joi.date().iso().required(),
    start_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, ""),
    end_date: Joi.date().iso().allow(null, ""),
    end_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, ""),
    image: Joi.string().allow(null, ""),
    is_active: Joi.boolean().default(true)
});

const getAnnouncement = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url, true);
        const page = parseInt(parsedUrl.query.page) || 1;
        const limit = parseInt(parsedUrl.query.limit) || 10;
        const search = parsedUrl.query.search || "";
        const type = parsedUrl.query.type || "";
        const response = await getAllAnnouncements(limit, page, search, type);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const createAnnouncement = async (req, res) => {
    try {
        const { error, value } = announcementSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(e => e.message);
            return res.error(422, messages);
        }

        const response = await insertAnnouncement(value);
        return res.success(201, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const { error, value } = announcementSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(e => e.message);
            return res.error(422, messages);
        }

        if (!value.id) return res.error(422, "ID is required.");

        const response = await editAnnouncementById(value);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.error(422, "ID is required.");

        const response = await deleteAnnouncementById(id);
        return res.success(200, response);
    } catch (error) {
        console.error(error);
        return res.error(500, error.message);
    }
};

module.exports = {
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
};
