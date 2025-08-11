const db = require('../models');
const { Mood } = db;

const moodResolvers = {
  Query: {
    getMoodById: async (_, { id }) => {
      try {
        const mood = await Mood.findByPk(id);
        return mood;
      } catch (err) {
        console.error('getMoodById error:', err);
        throw new Error('Internal Server Error');
      }
    },
  },
};

module.exports = moodResolvers;
