const pool = require("../config/db");

const AnnouncementModel = {
    async getAllAnnouncements(limit, page, search, type) {
        const offset = (page - 1) * limit;

        try {
            let dataResult, countResult;

            let where = "";
            let values = [];
            let count = 1;

            // search across title, category and content (case-insensitive)
            if (search && String(search).trim() !== "") {
                where += ` AND (title ILIKE $${count} OR category ILIKE $${count} OR content ILIKE $${count})`;
                values.push(`%${search}%`);
                count++;
            }

            // add type filter clauses (uses Jakarta time)
            if (type) {
                if (type === "active") {
                    where += ` AND is_active = true`;
                } else if (type === "nonactive" || type === "inactive") {
                    where += ` AND is_active = false`;
                } else if (type === "berlangsung") {
                    where += ` AND (
                        (to_timestamp(start_date::text || ' ' || start_time::text, 'YYYY-MM-DD HH24:MI') AT TIME ZONE 'Asia/Jakarta')
                            <= (NOW() AT TIME ZONE 'Asia/Jakarta')
                        AND COALESCE(
                            (to_timestamp(end_date::text || ' ' || end_time::text, 'YYYY-MM-DD HH24:MI') AT TIME ZONE 'Asia/Jakarta'),
                            'infinity'::timestamp
                        ) >= (NOW() AT TIME ZONE 'Asia/Jakarta')
                    )`;
                } else if (type === "kedaluarsa") {
                    where += ` AND (
                        COALESCE(
                            (to_timestamp(end_date::text || ' ' || end_time::text, 'YYYY-MM-DD HH24:MI') AT TIME ZONE 'Asia/Jakarta'),
                            '-infinity'::timestamp
                        ) < (NOW() AT TIME ZONE 'Asia/Jakarta')
                    )`;
                }
            }

            const dataQuery = `
                WITH now_jakarta AS (
                    SELECT (NOW() AT TIME ZONE 'Asia/Jakarta')::timestamp AS now
                )
                SELECT 
                    id,
                    category,
                    title,
                    content,
                    TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
                    TO_CHAR(start_time, 'HH24:MI') AS start_time,
                    TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
                    TO_CHAR(end_time, 'HH24:MI') AS end_time,
                    image,
                    is_active,
                    CASE
                        WHEN end_date IS NULL AND (to_timestamp(start_date::text || ' ' || start_time::text, 'YYYY-MM-DD HH24:MI')::timestamp) <= (SELECT now FROM now_jakarta) THEN true
                        WHEN (to_timestamp(start_date::text || ' ' || start_time::text, 'YYYY-MM-DD HH24:MI')::timestamp) <= (SELECT now FROM now_jakarta)
                             AND (to_timestamp(end_date::text || ' ' || end_time::text, 'YYYY-MM-DD HH24:MI')::timestamp) >= (SELECT now FROM now_jakarta) THEN true
                        WHEN (to_timestamp(start_date::text || ' ' || start_time::text, 'YYYY-MM-DD HH24:MI')::timestamp) > (SELECT now FROM now_jakarta) THEN true
                        ELSE false
                    END AS is_current,
                    created_at,
                    updated_at
                FROM announcements
                WHERE 1=1
                ${where}
                ORDER BY
                    CASE
                        WHEN (to_timestamp(start_date::text || ' ' || start_time::text, 'YYYY-MM-DD HH24:MI')::timestamp) <= (SELECT now FROM now_jakarta)
                             AND COALESCE((to_timestamp(end_date::text || ' ' || end_time::text, 'YYYY-MM-DD HH24:MI')::timestamp), 'infinity'::timestamp) >= (SELECT now FROM now_jakarta)
                        THEN 0
                        ELSE 1
                    END,
                    start_date DESC,
                    start_time ASC
                LIMIT $${count} OFFSET $${count + 1}
            `;

            values.push(limit, offset);

            dataResult = await pool.query(dataQuery, values);

            const countQuery = `SELECT COUNT(*) FROM announcements WHERE 1=1 ${where}`;
            countResult = await pool.query(countQuery, values.slice(0, values.length - 2));

            const total = parseInt(countResult.rows[0].count, 10);
            const last_page = Math.ceil(total / limit);

            return {
                data: dataResult.rows,
                total,
                page,
                last_page,
            };
        } catch (error) {
            console.error("Error fetching announcements:", error);
            throw error;
        }
    },

    async insertAnnouncement(data) {
        const {
            category,
            title,
            content,
            start_date,
            start_time,
            end_date,
            end_time,
            image,
            is_active,
        } = data;

        const result = await pool.query(
            `INSERT INTO announcements
            (category, title, content, start_date, start_time, end_date, end_time, image, is_active)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [category, title, content, start_date, start_time, end_date, end_time, image, is_active]
        );
        return result.rows[0];
    },

    async editAnnouncementById(data) {
        const {
            id,
            category,
            title,
            content,
            start_date,
            start_time,
            end_date,
            end_time,
            image,
            is_active,
        } = data;

        const result = await pool.query(
            `UPDATE announcements SET
            category=$1, title=$2, content=$3, start_date=$4, start_time=$5,
            end_date=$6, end_time=$7, image=$8, is_active=$9, updated_at=NOW()
            WHERE id=$10 RETURNING *`,
            [category, title, content, start_date, start_time, end_date, end_time, image, is_active, id]
        );
        return result.rows[0];
    },

    async deleteAnnouncementById(id) {
        const result = await pool.query("DELETE FROM announcements WHERE id=$1 RETURNING *", [id]);
        return result.rows[0];
    },
};

module.exports = AnnouncementModel;
