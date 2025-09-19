const {
    insertFeedback
} = require("../models/feedbackModel");

const createFeedback = async (req, res) => {
    try {
        const message = req.body.message;

        const rawIp =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip;

        const ip = rawIp.startsWith("::ffff:") ? rawIp.replace("::ffff:", "") : rawIp;

        const response = await insertFeedback(message, ip);

        if (!response) {
            return res.error(429, "You are sending feedback too quickly. Please try again later.");
        }

        return res.success(201, response);

    } catch (error) {
        console.error(error);
        return res.error(500, "Failed to insert feedback");
    }
}

module.exports = {
    createFeedback
}