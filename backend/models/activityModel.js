const pool = require("../config/db");

const Actifity = {
    async getAllActivity(limit, page, date) {
        const offset = (page - 1) * limit;

        try {
            let dataResult, countResult;

            if (date) {
                let where = 'WHERE deleted_at IS NULL';
                let values = [];
                let count = 1;

                if (date) {
                    where += ` AND activity_date = $${count}`;
                    values.push(date);
                    count++;
                }

                const dataQuery = `
                SELECT 
                    id,
                    TO_CHAR(activity_date, 'YYYY-MM-DD') AS activity_date,
                    description,
                    location,
                    title
                    FROM activities
                    ${where}
                    ORDER BY activity_date DESC
                LIMIT $${count} OFFSET $${count + 1}
                `;

                values.push(limit, offset);

                dataResult = await pool.query(dataQuery, values);

                const countQuery = `SELECT COUNT(*) FROM activities ${where}`;

                countResult = await pool.query(countQuery, values.slice(0, values.length - 2));

                const total = parseInt(countResult.rows[0].count, limit);
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
                    `SELECT 
                        id,
                        TO_CHAR(activity_date, 'YYYY-MM-DD') AS activity_date,
                        description,
                        location,
                        title
                    FROM activities 
                    WHERE deleted_at IS NULL 
                    ORDER BY activity_date DESC
                    LIMIT $1 OFFSET $2`,
                    [limit, offset]
                );

                countResult = await pool.query(`SELECT COUNT(*) FROM activities WHERE deleted_at IS NULL`);
            }

            const total = parseInt(countResult.rows[0].count, limit);
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

    async deleteActivityById(id, deletedBy = null) {
        try {
            const now = new Date();
            const values = [now, id];

            let query = `UPDATE activities SET deleted_at = $1`;
            if (deletedBy) {
                query += `, deleted_by = $3`;
                values.push(deletedBy);
            }

            query += ` WHERE id = $2 RETURNING *`;

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error soft-deleting activity:", error);
            throw error;
        }
    },

    async updateActivity(id, title, activity_date, description, location) {
        console.log(id, title, activity_date, description, location);

        try {
            const result = await pool.query(
                `UPDATE activities SET title = $1, activity_date = $2, description = $3, location = $4 WHERE id = $5 RETURNING *`,
                [title, activity_date, description, location, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error updating activity:", error);
            throw error;
        }
    },

    async insertActivity(title, activity_date, description, location, created_by) {
        try {
            const result = await pool.query(
                `INSERT INTO activities (title, activity_date, description, location, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [title, activity_date, description, location, created_by]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error inserting activity:", error);
            throw error;
        }
    },

    async editActivity(id, title, activity_date, description, location) {
        try {
            const result = await pool.query(
                `UPDATE activities SET title = $1, activity_date = $2, description = $3, location = $4 WHERE id = $5 RETURNING *`,
                [title, activity_date, description, location, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error updating activity:", error);
            throw error;
        }
    },

    async getAllImagesActivity(limit, page) {
        try {
            const result = await pool.query(
                `SELECT
                    a.id,
                    a.title,
                    TO_CHAR(a.activity_date, 'YYYY-MM-DD') AS activity_date,
                    a.description,
                    a.location,
                    MAX(ai.path) AS path,
                    json_agg(ai.image) AS images
                    FROM activity_images ai
                    JOIN activities a ON ai.activity_id = a.id
                    WHERE a.deleted_at IS NULL
                    GROUP BY a.id, a.title;
                `
            );

            countResult = await pool.query(`SELECT COUNT(*) FROM activities WHERE deleted_at IS NULL`);

            const total = parseInt(countResult.rows[0].count, limit);
            const last_page = Math.ceil(total / limit);

            return {
                data: result.rows,
                total,
                page,
                last_page,
            };
        } catch (error) {
            console.error("Error fetching images:", error);
            throw error;
        }
    },

    async insertImagesActivity(activityId, images, uploadedBy = null) {
        try {
            const insertedImages = [];

            for (const image of images) {
                const result = await pool.query(
                    `INSERT INTO activity_images (activity_id, image, uploaded_by) VALUES ($1, $2, $3) RETURNING *`,
                    [parseInt(activityId), image.name, uploadedBy]
                );
                insertedImages.push(result.rows[0]);
            }

            return insertedImages;
        } catch (error) {
            console.error("Error inserting images:", error);
            throw error;
        }
    },

    async editImagesActivity(id, image_url) {
        try {
            const result = await pool.query(
                `UPDATE activity_images SET image_url = $1 WHERE activity_id = $2 RETURNING *`,
                [image_url, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error updating images:", error);
            throw error;
        }
    },

    async deleteImagesActivityByImage(image) {
        try {
            const result = await pool.query(
                `DELETE FROM activity_images WHERE image = $1 RETURNING *`,
                [image]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error deleting images:", error);
            throw error;
        }
    },

}

module.exports = Actifity;