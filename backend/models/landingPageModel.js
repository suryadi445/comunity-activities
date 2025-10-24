const pool = require("../config/db");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const { validateFile, moveUploadedFile } = require("../utils/fileHandler");
const FILE_UPLOAD_PATH = process.env.FILE_UPLOAD_PATH

const LandingPage = {
    async getAllLandingPageContents() {
        const landing = await pool.query(
            "SELECT * FROM landing_page_contents order by id asc"
        );

        const grouped = landing.rows.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, {});

        return grouped;
    },

    async getLandingPageContentsByType(type) {
        const landing = await pool.query(
            "SELECT * FROM landing_page_contents WHERE type = $1",
            [type]
        );
        return landing.rows;
    },

    async editLandingPageContents(type, fields) {
        if (!type) throw new Error("Type is required");

        let setClause = [];
        let params = [];
        let paramIndex = 1;

        let whereClause = "";
        if (type === "slideshow") {
            if (fields.header !== undefined) {
                setClause.push(`header = $${paramIndex++}`);
                params.push(fields.header);
            }
            if (fields.title !== undefined) {
                setClause.push(`title = $${paramIndex++}`);
                params.push(fields.title);
            }
            if (fields.image) {
                setClause.push(`image = $${paramIndex++}`);
                params.push(fields.image);

                setClause.push(`is_edit = $${paramIndex++}`);
                params.push(true);
            }

            whereClause = `id = $${paramIndex++} AND type = $${paramIndex++}`;
            params.push(parseInt(fields.imageNumber, 10), type);

        } else if (type === "about_us") {
            if (fields.vision_mission !== undefined) {
                setClause.push(`vision_mission = $${paramIndex++}`);
                params.push(fields.vision_mission);
            }
            if (fields.description !== undefined) {
                setClause.push(`description = $${paramIndex++}`);
                params.push(fields.description);
            }
            if (fields.principles !== undefined) {
                // save principles as JSON string
                setClause.push(`principle = $${paramIndex++}`);
                params.push(JSON.stringify(fields.principles));
            }

            whereClause = `type = $${paramIndex++}`;
            params.push(type);
        } else if (type === "transaction") {
            if (fields.description !== undefined) {
                setClause.push(`description = $${paramIndex++}`);
                params.push(fields.description);
            }

            whereClause = `type = $${paramIndex++}`;
            params.push(type);
        } else if (type === "footer") {
            console.log(type);

            if (fields.latitude !== undefined) {
                setClause.push(`latitude = $${paramIndex++}`);
                params.push(fields.latitude);
            }
            if (fields.longitude !== undefined) {
                setClause.push(`longitude = $${paramIndex++}`);
                params.push(fields.longitude);
            }
            if (fields.footer !== undefined) {
                // save footer as JSON string
                setClause.push(`footer = $${paramIndex++}`);
                params.push(fields.footer);
            }

            whereClause = `type = $${paramIndex++}`;
            params.push(type);
        } else {
            throw new Error("Unsupported type");
        }

        if (setClause.length === 0) {
            throw new Error("No fields to update");
        }


        const query = `
            UPDATE landing_page_contents
            SET ${setClause.join(", ")}
            WHERE ${whereClause}
            RETURNING *
        `;

        console.log("SQL Query:", query);
        console.log("Params:", params);

        const landing = await pool.query(query, params);
        return landing.rows[0];

    },

    async updateStructure(type, fields, userId) {
        if (type !== "structure") return;

        const result = {
            leader: null,
            assistants: []
        };

        // --- Update Leader ---
        if (fields.leader) {
            let setClause = [];
            let params = [];
            let paramIndex = 1;

            if (fields.leader.title !== undefined) {
                setClause.push(`leader_title = $${paramIndex++}`);
                params.push(fields.leader.title);
            }
            if (fields.leader.name !== undefined) {
                setClause.push(`leader_name = $${paramIndex++}`);
                params.push(fields.leader.name);
            }
            if (fields.leader.phone !== undefined) {
                setClause.push(`leader_phone = $${paramIndex++}`);
                params.push(fields.leader.phone);
            }

            if (fields.leader.image !== undefined && fields.leader.image !== null && fields.leader.image !== "") {
                setClause.push(`path = $${paramIndex++}`);
                params.push(FILE_UPLOAD_PATH);

                setClause.push(`image = $${paramIndex++}`);
                params.push(fields.leader.image);
            }

            if (setClause.length > 0) {
                params.push(type);
                const leaderQuery = `
                    UPDATE landing_page_contents
                    SET ${setClause.join(", ")}
                    WHERE type = $${paramIndex++} 
                    AND leader_title != ''
                    RETURNING *;
                `;
                const leaderRes = await pool.query(leaderQuery, params);
                if (leaderRes.rows.length > 0) {
                    result.leader = leaderRes.rows[0];
                }
            }
        }

        // --- Update Assistants ---
        if (fields.assistants && Array.isArray(fields.assistants)) {
            // get old value
            const oldAssistantsRes = await pool.query(
                `SELECT assistant_title, assistant_name, assistant_phone, image, path 
                FROM landing_page_contents 
                WHERE type = $1 
                AND (leader_title IS NULL OR leader_title = '')`,
                [type]
            );
            const oldAssistants = oldAssistantsRes.rows;

            // remove old assistent
            await pool.query(
                `DELETE FROM landing_page_contents 
                WHERE type = $1 
                AND ( (leader_title IS NULL OR leader_title = '') 
                AND (leader_name IS NULL OR leader_name = '') 
                AND (leader_phone IS NULL OR leader_phone = '') )`,
                [type]
            );

            for (let i = 0; i < fields.assistants.length; i++) {
                const assistant = fields.assistants[i];
                const old = oldAssistants[i]; // asumsinya urutan sama

                const image = assistant.image && assistant.image !== ""
                    ? assistant.image
                    : (old ? old.image : null);

                const path = image ? FILE_UPLOAD_PATH : null;

                const insertQuery = `
                    INSERT INTO landing_page_contents 
                    (type, user_id, assistant_title, assistant_name, assistant_phone, path, image)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;

                const values = [
                    type,
                    userId || null,
                    assistant.title,
                    assistant.name,
                    assistant.phone,
                    path,
                    image,
                ];

                const res = await pool.query(insertQuery, values);
                if (res.rows.length > 0) {
                    result.assistants.push(res.rows[0]);
                }
            }
        }

        return result;
    },

    uploadStructureFile(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, "../uploads/images");
            form.keepExtensions = true;

            if (!fs.existsSync(form.uploadDir)) {
                fs.mkdirSync(form.uploadDir, { recursive: true });
            }

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error("❌ Form parse error:", err);
                    return reject({ status: 500, message: "Form parsing error" });
                }

                // Normalisasi fields: ambil value tunggal (bukan array)
                for (const key in fields) {
                    if (Array.isArray(fields[key])) {
                        fields[key] = fields[key][0];
                    }
                }

                // --- Handle Leader Image ---
                let leaderImage = null;
                if (files.image) {
                    const file = Array.isArray(files.image) ? files.image[0] : files.image;
                    const { valid, error } = validateFile(file, "image");
                    if (!valid) return reject({ status: 400, message: error });

                    const result = moveUploadedFile(file, form.uploadDir);
                    if (!result) return reject({ status: 500, message: "Failed to move leader image" });

                    leaderImage = result.newFileName;
                }

                // --- Handle Assistants Images ---
                const assistants = [];
                let i = 0;
                while (fields[`assistant_name_${i}`]) {
                    let assistantImage = null;
                    const key = `assistant_image_${i}`;

                    if (files[key]) {
                        const file = Array.isArray(files[key]) ? files[key][0] : files[key];
                        const { valid, error } = validateFile(file, "image");
                        if (!valid) return reject({ status: 400, message: error });

                        const result = moveUploadedFile(file, form.uploadDir);
                        if (!result) return reject({ status: 500, message: "Failed to move assistant image" });

                        assistantImage = result.newFileName;
                    }

                    assistants.push({
                        title: fields[`assistant_title_${i}`],
                        name: fields[`assistant_name_${i}`],
                        phone: fields[`assistant_phone_${i}`],
                        image: assistantImage,
                    });

                    i++;
                }

                // Return hasil parsing
                resolve({
                    type: fields.type,
                    leader: {
                        name: fields.leaderName,
                        phone: fields.leaderPhone,
                        title: fields.leaderTitle,
                        image: leaderImage,
                    },
                    assistants,
                });
            });
        });
    },

}

module.exports = LandingPage;
