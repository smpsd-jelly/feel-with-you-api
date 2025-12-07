const db = require("../models");
const { Config } = db;
const configResolvers = {
    Query: {
        getConfigById: async (_, { id }) => {
            try {
                const config = await Config.findByPk(id);
                return config;
            } catch (err) {
                console.error("getConfigById error:", err);
                throw new Error("Internal Server Error");
            }
        },
        getConfigByCode: async (_, { config_code }) => {
            // Change findOne to findAll
            return await Config.findAll({
                where: {
                    config_code: config_code
                }
            });
        },
    }
};
module.exports = configResolvers;