const { Op } = require("sequelize");
const { UserQuestionAnswer, UserQuestionScores } = require("../models");
const {
  ConfigQuestionGroup,
  ConfigQuestionScore,
} = require("../Enum/ConfigEnum");
const { normalizeThaiDayRange, now } = require("../../helper/thThime");

module.exports = {
  Query: {
    getUserScore: async (_, { user_id }) => {
      try {
        const recentScore = await UserQuestionScores.findOne({
          where: {
            user_id: user_id,
          },
          order: [["created_at", "DESC"]],
        });

        if (!recentScore) {
          return null;
        }
        return recentScore;
      } catch (err) {
        console.error("getUserScore error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },
  Mutation: {
    saveUserScore: async (_, { user_id }) => {
      try {
        // Calculate Start & End of "Today" in GMT+7
        const { start: startOfDay, end: endOfDay } = normalizeThaiDayRange(
          now()
        );

        // Fetch User's Answers for Today
        const userAnswers = await UserQuestionAnswer.findAll({
          where: {
            user_id: user_id,
            created_at: {
              [Op.gte]: startOfDay,
              [Op.lt]: endOfDay,
            },
          },
        });

        // If no answers found, return null (Nothing to save)
        if (!userAnswers || userAnswers.length === 0) {
          return null;
        }

        // Calculate Scores
        let totalScore = 0;

        userAnswers.forEach((record) => {
          const status = record.question_status;
          const rawScoreStr = record.question_score;
          const rawScoreInt = parseInt(rawScoreStr, 10);

          if (isNaN(rawScoreInt)) return;

          if (status === ConfigQuestionGroup._GROUP_1) {
            // Reverse Logic
            if (
              rawScoreInt ===
              parseInt(ConfigQuestionScore._QUESTION_SCORE_3, 10)
            )
              totalScore += 0;
            else if (
              rawScoreInt ===
              parseInt(ConfigQuestionScore._QUESTION_SCORE_2, 10)
            )
              totalScore += 1;
            else if (
              rawScoreInt ===
              parseInt(ConfigQuestionScore._QUESTION_SCORE_1, 10)
            )
              totalScore += 2;
          } else {
            // Direct Logic
            totalScore += rawScoreInt;
          }
        });

        // Prepare Data for Insert
        const referenceRecord = userAnswers[0];
        const scoreData = {
          user_id: user_id,
          total_score: totalScore,
          created_at: referenceRecord.created_at, // Use the time from the answer
          updated_at: new Date(), 
        };

        // Insert the score
        const newScoreRecord = await UserQuestionScores.create(scoreData);

        // Return the RECORDED data
        return newScoreRecord;
      } catch (err) {
        console.error("saveUserScore error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },
};
