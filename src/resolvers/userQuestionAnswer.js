const db = require('../models');
const { Sequelize } = db;
const { UserQuestionAnswer } = db;

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
};

module.exports = userQuestionAnswerResolvers;
