const pool = require("../config/db");

const Feedback = {
    async insertFeedback(message, ipAddress) {
        const check = await pool.query(
            `SELECT 1 
                FROM feedbacks 
                WHERE ip_address = $1 
                AND created_at >= NOW() - INTERVAL '1 day'
                ORDER BY id desc
                LIMIT 1`,
            [ipAddress]
        );

        if (check.rows.length > 0) {
            return null;
        }

        try {
            const result = await pool.query(
                `INSERT INTO feedbacks (message, ip_address) VALUES ($1, $2) RETURNING *`,
                [message, ipAddress]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error inserting feedback:", error);
            throw error;
        }
    },
}

module.exports = Feedback;