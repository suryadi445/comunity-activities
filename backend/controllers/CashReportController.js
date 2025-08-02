const Joi = require("joi");
const url = require("url");
const {
    insertCashReport,
    getAllCashReports,
    editCashReport,
    deleteCashReportById,
    cashBalance
} = require("../models/cashReportModel");

// Base Schema
const baseSchema = {
    date: Joi.date().iso().required().messages({
        "any.required": "Date is required.",
        "date.base": "Date must be a valid date (format should be YYYY-MM-DD).",
        "date.format": "Date must be in ISO format (YYYY-MM-DD).",
    }),
    description: Joi.string().min(3).required().messages({
        "any.required": "Description is required.",
        "string.empty": "Description cannot be empty.",
        "string.min": "Description must be at least 3 characters long.",
    }),
    amount: Joi.number().positive().required().messages({
        "any.required": "Amount is required.",
        "number.base": "Amount must be a valid number.",
        "number.positive": "Amount must be greater than 0.",
    }),
    type: Joi.string().valid("in", "out").required().messages({
        "any.required": "Transaction type is required.",
        "any.only": 'Transaction type must be either "in" or "out".',
    }),
    category: Joi.string().allow(null, "").optional(),
};

// for create validation
const createCashReportSchema = Joi.object({
    ...baseSchema,
});

// for update validation
const updateCashReportSchema = Joi.object({
    id: Joi.number().required().messages({
        "any.required": "ID is required for update.",
        "number.base": "ID must be a number.",
    }),
    ...baseSchema,
});

// GET ALL CASH REPORTS
const getCashReports = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const page = parseInt(parsedUrl.query.page) || 1;
    const limit = parseInt(parsedUrl.query.limit) || 10;
    const type = parsedUrl.query.type || "";
    const date = parsedUrl.query.date || "";

    try {
        const response = await getAllCashReports(limit, page, type, date);
        res.success(200, response);
    } catch (error) {
        console.log(error);
        res.error(500, error.message);
    }
};

// CREATE CASH REPORT
const createCashReports = async (req, res) => {
    const data = {
        ...req.body,
        user_id: req.user?.id || null,
    };

    const { error } = createCashReportSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationMessages = error.details.map((detail) => detail.message);
        return res.error(422, validationMessages);
    }

    try {
        const response = await insertCashReport(data);
        return res.success(201, response);
    } catch (error) {
        return res.error(500, error.message);
    }
};

// UPDATE CASH REPORT
const updateCashReports = async (req, res) => {
    const data = {
        ...req.body,
        user_id: req.user?.id || null,
    };

    const { error } = updateCashReportSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const validationMessages = error.details.map((detail) => detail.message);
        return res.error(422, validationMessages);
    }

    try {
        const response = await editCashReport(data);
        return res.success(200, response);
    } catch (error) {
        return res.error(500, error.message);
    }
};

// DELETE CASH REPORT
const deleteCashReports = async (req, res) => {
    const data = {
        ...req.body,
        user_id: req.user?.id || null,
    };

    try {
        const response = await deleteCashReportById(data);
        return res.success(200, response);
    } catch (error) {
        return res.error(500, error.message);
    }
};

const getCashBalance = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const type = parsedUrl.query.type || "";
    const date = parsedUrl.query.date || "";

    try {
        const response = await cashBalance(type, date);
        return res.success(200, response);
    } catch (error) {
        return res.error(500, error.message);
    }
};

module.exports = {
    getCashReports,
    createCashReports,
    updateCashReports,
    deleteCashReports,
    getCashBalance
};
