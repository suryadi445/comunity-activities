const {
    getAllLandingPageContents,
    getLandingPageContentsByType,
    editLandingPageContents,
    uploadStructureFile,
    updateStructure,
} = require("../models/landingPageModel");
const {
    parseRequest
} = require("../utils/fileHandler")

const getLandingPage = async (req, res) => {
    try {
        const landing = await getAllLandingPageContents();
        return res.success(200, landing);
    } catch (error) {
        console.error(error);
        return res.error(500, "Failed to fetch landing page contents");
    }
};

const getLandingPageType = async (req, res) => {
    const type = req.query.type || "";
    try {
        const landing = await getLandingPageContentsByType(type);
        return res.success(200, landing);
    } catch (error) {
        console.error(error);
        return res.error(500, "Failed to fetch landing page contents by type")
    }
};

const updateLandingPage = async (req, res) => {
    const { fields, imageName } = await parseRequest(req);

    const { type } = fields;
    fields.userId = req.user?.id;

    if (imageName) {
        fields.image = imageName;
    }

    try {
        const landing = await editLandingPageContents(type, fields);
        return res.success(200, landing);
    } catch (error) {
        console.error(error);
        return res.error(500, "Failed to update landing page contents");
    }
};

const updateLandingPageStructure = async (req, res) => {
    try {
        const type = 'structure';
        const data = await uploadStructureFile(req, res);
        const userId = req.user?.id;

        const landing = await updateStructure(type, data, userId);
        return res.success(200, landing);
    } catch (error) {
        console.error(error);
        return res.error(500, "Failed to update landing page contents");
    }
};

module.exports = {
    getLandingPage,
    getLandingPageType,
    updateLandingPage,
    updateLandingPageStructure,
};
