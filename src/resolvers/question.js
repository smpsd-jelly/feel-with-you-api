const db = require("../models");
const { Question } = db;

const questionResolvers = {
  Query: {
    getAllQuestion: async () => {
      try {
        return await Question.findAll({
          order: [["id", "ASC"]],
        });
      } catch (err) {
        console.error("getAllQuestion error:", err);
        throw new Error("Internal Server Error");
      }
    },

    getQuestionById: async (_, { id }) => {
      try {
        const row = await Question.findByPk(id);
        return row;
      } catch (err) {
        console.error("getQuestionById error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },
};

module.exports = questionResolvers;
