const db = require("../models");
const { Op } = require("sequelize");
const { Mood } = db;

const DEFAULT_MOOD_NAME = 'default';

const moodResolvers = {
  Query: {
    getMoodById: async (_, { id }) => {
      try {
        const mood = await Mood.findByPk(id);
        return mood;
      } catch (err) {
        console.error("getMoodById error:", err);
        throw new Error("Internal Server Error");
      }
    },
    getMoodByName: async (_, { name }) => {
      try {
        const mood = await Mood.findOne({
          where: { name: { [Op.like]: name } },
        });
        return mood;
      } catch (err) {
        console.error("getMoodByName error:", err);
        throw new Error("Internal Server Error");
      }
    },
    getDefaultMood: async () => {
      try {
        return await Mood.findOne({
          where: { name: { [Op.eq]: DEFAULT_MOOD_NAME } },
        });
      } catch (err) {
        console.error("getDefaultMood error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },
};

module.exports = moodResolvers;
