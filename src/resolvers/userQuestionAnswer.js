const db = require('../models');
const { Sequelize } = db;
const { UserQuestionAnswer } = db;
const { Op } = require("sequelize");

const userQuestionAnswerResolvers = {
  Query: {
    getAllUserQuestionAnswers: async (_, args) => {
      try {
        const where = {};
        if (args.user_id != null) where.user_id = args.user_id;

        return await UserQuestionAnswer.findAll({
          where,
          order: [['id', 'ASC']],
        });
      } catch (err) {
        console.error('getAllUserQuestionAnswers error:', err);
        throw new Error('Internal Server Error');
      }
    },

    // สรุปคำตอบของผู้ใช้: นับจำนวนในแต่ละ status และหาค่าที่มากสุด
    getUserAnswerStats: async (_, { user_id }) => {
      try {
        // ดึงแบบ group โดยใช้ COUNT(status)
        const rows = await UserQuestionAnswer.findAll({
          attributes: [
            'status',
            [db.sequelize.fn('COUNT', db.sequelize.col('status')), 'count'],
          ],
          where: { user_id },
          group: ['status'],
          order: [[db.sequelize.literal('count'), 'DESC']],
          raw: true,
        });

        // รวม total และแปลงผลลัพธ์เป็น breakdown
        let total = 0;
        const breakdown = rows.map((r) => {
          const count = Number(r.count);
          total += count;
          return { status: r.status, count };
        });

        // หาอันที่มากสุด (ถ้าไม่มีข้อมูล ให้คืน null)
        let mostCommonStatus = null;
        let mostCommonCount = null;
        if (breakdown.length > 0) {
          mostCommonStatus = breakdown[0].status;
          mostCommonCount = breakdown[0].count;
        }

        return {
          user_id,
          total,
          breakdown,
          mostCommonStatus,
          mostCommonCount,
        };
      } catch (err) {
        console.error('getUserAnswerStats error:', err);
        throw new Error('Internal Server Error');
      }
    },
  },

  Mutation: {
    addBulkUserQuestionAnswers: async (_, { user_id, answers }) => {
      try {
        // คำนวน Start & End of "Today" in GMT+7
        const now = new Date();
        const THAI_OFFSET = 7 * 60 * 60 * 1000;
        const thaiTime = new Date(now.getTime() + THAI_OFFSET);
        thaiTime.setUTCHours(0, 0, 0, 0);

        const startOfDay = new Date(thaiTime.getTime() - THAI_OFFSET);
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        // Validation: Check if user has ALREADY submitted answers today
        const existingSession = await UserQuestionAnswer.findOne({
          where: {
            user_id: user_id,
            created_at: {
              [Op.gte]: startOfDay,
              [Op.lt]: endOfDay,
            },
          },
        });

        if (existingSession) {
          throw new Error("You have already submitted your answers for today. Please try again tomorrow.");
        }

        // Prepare data for Bulk Insert
        const dataToInsert = answers.map((answer) => ({
          user_id: user_id,
          question_id: answer.question_id,
          question_status: answer.question_status,
          question_score: answer.question_score,
          created_at: now,
          updated_at: now,
        }));

        // Perform Bulk Insert
        const newRecords = await UserQuestionAnswer.bulkCreate(dataToInsert, { validate: true });

        return newRecords;
      } catch (err) {
        // log errors in Mutation a
        console.error('addBulkUserQuestionAnswers error:', err);
        throw err; // Re-throw so GraphQL returns the error to the client
      }
    },
  },
};

module.exports = userQuestionAnswerResolvers;