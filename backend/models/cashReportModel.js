const pool = require("../config/db");

const CashReports = {

    async getAllCashReports(limit, page, type, date) {
        const offset = (page - 1) * limit;

        try {
            let dataResult, countResult;

            if (date || type) {
                let where = 'WHERE deleted_at IS NULL';
                let values = [];
                let count = 1;

                if (date) {
                    where += ` AND date = $${count}`;
                    values.push(date);
                    count++;
                }

                if (type) {
                    where += ` AND type = $${count}`;
                    values.push(type);
                    count++;
                }

                const dataQuery = `
                    SELECT id,
                        TO_CHAR(date, 'YYYY-MM-DD') AS date,
                        description,
                        amount,
                        type,
                        category,
                        user_id,
                        created_at,
                        updated_at
                    FROM cash_reports
                    ${where}
                    ORDER BY id DESC
                LIMIT $${count} OFFSET $${count + 1}
                `;

                values.push(limit, offset);

                dataResult = await pool.query(dataQuery, values);

                const countQuery = `SELECT COUNT(*) FROM cash_reports ${where}`;

                countResult = await pool.query(countQuery, values.slice(0, values.length - 2));

                const total = parseInt(countResult.rows[0].count, 10);
                const last_page = Math.ceil(total / limit);

                return {
                    data: dataResult.rows,
                    total,
                    page,
                    last_page,
                };
            }
            else {
                // Query tanpa pencarian
                dataResult = await pool.query(
                    `SELECT id,
                        TO_CHAR(date, 'YYYY-MM-DD') AS date,
                        description,
                        amount,
                        type,
                        category,
                        user_id,
                        created_at,
                        updated_at
                    FROM cash_reports WHERE deleted_at IS NULL ORDER BY id DESC LIMIT $1 OFFSET $2`,
                    [limit, offset]
                );

                countResult = await pool.query(`SELECT COUNT(*) FROM cash_reports WHERE deleted_at IS NULL`);
            }

            const total = parseInt(countResult.rows[0].count, 10);
            const last_page = Math.ceil(total / limit);

            return {
                data: dataResult.rows,
                total,
                page,
                last_page,
            };
        } catch (error) {
            console.error("Error fetching cash reports:", error);
            throw error;
        }
    },

    async insertCashReport(data) {
        const {
            date,
            description,
            amount,
            type,
            category = null,
            user_id
        } = data;

        const query = `
            INSERT INTO cash_reports 
            (date, description, amount, type, category, user_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING *
        `;

        const values = [date, description, amount, type, category, user_id];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async editCashReport(data) {
        const {
            id,
            date,
            description,
            amount,
            type,
            category = null,
            user_id
        } = data;

        const query = `
            UPDATE cash_reports
            SET date = $2, description = $3, amount = $4, type = $5, category = $6, user_id = $7, updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;

        const values = [id, date, description, amount, type, category, user_id];

        const result = await pool.query(query, values);

        return result.rows[0];
    },

    async deleteCashReportById(data) {
        const { id, user_id, reason } = data;
        try {
            const result = await pool.query(
                `UPDATE cash_reports 
             SET deleted_at = NOW(),
                 deleted_by = $2,
                 reason = $3
             WHERE id = $1 
             RETURNING *`,
                [id, user_id, reason]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error soft-deleting cash report:", error);
            throw error;
        }
    },

    async cashBalance(type, date) {
        try {
            let query = `
            SELECT SUM(amount) AS total_amount
            FROM cash_reports
            WHERE deleted_at IS NULL
            AND type = 'in'
        `;
            const values = [];
            let paramIndex = 1;

            if (type) {
                query += ` AND type = $${paramIndex}`;
                values.push(type);
                paramIndex++;
            }

            if (date) {
                query += ` AND TO_CHAR(date, 'YYYY-MM-DD') = $${paramIndex}`;
                values.push(date);
                paramIndex++;
            }

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error fetching cash balance:", error);
            throw error;
        }
    }
};

module.exports = CashReports;
