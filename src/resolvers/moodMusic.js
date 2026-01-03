const db = require("../models");
const { MoodMusic, Mood } = db;
const { toThaiISOString } = require("../../helper/thThime");

const moodMusicResolvers = {
  Query: {
    getAllMoodMusic: async () => {
      try {
        return await MoodMusic.findAll({
          include: [{ model: Mood, as: "mood" }],
          order: [["id", "ASC"]],
        });
      } catch (err) {
        console.error("getAllMoodMusic error:", err);
        throw new Error("Internal Server Error");
      }
    },
    getMoodMusicByMoodId: async (_, { mood_id }) => {
      try {
        return await MoodMusic.findAll({
          where: { mood_id },
          include: [{ model: Mood, as: "mood" }],
          order: [["id", "ASC"]],
        });
      } catch (err) {
        console.error("getMoodMusicByMoodId error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  MoodMusic: {
    created_at: (parent) => toThaiISOString(parent.created_at),
  },
};

module.exports = moodMusicResolvers;
