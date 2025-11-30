const db = require("../models");
const { Op } = require("sequelize");
const { MoodCalendar, Users, Mood } = db;

function normalizeDayRange(d) {
  const base = new Date(d);
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

const moodCalendarResolvers = {
  Query: {
    getMoodCalendarByUserId: async (_, { user_id, start, end }) => {
      try {
        const where = { user_id };

        if (start && end) {
          where.mood_date = { [Op.gte]: new Date(start), [Op.lt]: new Date(end) };
        }

        return await MoodCalendar.findAll({
          where,
          order: [["mood_date", "ASC"]],
          include: [
            { model: Users, as: "user", attributes: ["id", "email", "name"] },
            { model: Mood, as: "mood" },
          ],
        });
      } catch (err) {
        console.error("getMoodCalendarByUserId error:", err);
        throw new Error("Internal Server Error");
      }
    },
    getUserNoteByUserId: async (_, { user_id }) => {
      try {
        return await UserNote.findAll({
          where: { user_id },
          order: [["note_date", "DESC"]],
          include: [
            { model: Users, as: "user", attributes: ["id", "email", "name"] },
          ],
        });
      } catch (err) {
        console.error("getUserNoteByUserId error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  Mutation: {
    // บันทึก mood pic ตามวัน 
    // บันทึกได้วันละ 1 ครั้ง: ถ้ามีอยู่แล้วในวันเดียวกัน (ของ user เดียวกัน) => อัปเดต mood_id แทน
    createMoodCalendarByDay: async (_, { input }) => {
      const { user_id, mood_id, mood_date } = input;
      const queryRunner = await db.sequelize.transaction();
      try {
        const { start, end } = normalizeDayRange(mood_date);

        // หาว่ามี record วันนี้ของ user นี้แล้วหรือยัง
        const existing = await MoodCalendar.findOne({
          where: {
            user_id,
            mood_date: { [Op.gte]: start, [Op.lt]: end },
          },
          transaction: queryRunner,
          lock: queryRunner.LOCK.UPDATE, // optional: row lock for race conditions
        });

        let result;
        if (existing) {
          // อัปเดต mood ของวันเดิม
          await existing.update({ 
            mood_id, 
            updated_at: new Date() }, 
            { transaction: queryRunner });
          result = await MoodCalendar.findByPk(existing.id, {
            include: [
              {
                model: db.Users,
                as: "user",
                attributes: ["id", "email", "name"],
              },
              {
                model: db.Mood,
                as: "mood"
              },
            ],
            transaction: queryRunner,
          });
        } else {
          // ยังไม่มี -> สร้างใหม่
          const created = await MoodCalendar.create(
            {
              user_id,
              mood_id,
              mood_date: mood_date ?? new Date(),
              created_at: new Date(),
            },
            { transaction: queryRunner }
          );

          result = await MoodCalendar.findByPk(created.id, {
            include: [
              {
                model: db.Users,
                as: "user",
                attributes: ["id", "email", "name"]
              },
              {
                model: db.Mood,
                as: "mood"
              },
            ],
            transaction: queryRunner,
          });
        }
        await queryRunner.commit();
        return result;

      } catch (err) {
        await queryRunner.rollback();
        console.error("createMoodCalendarByDay error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  MoodCalendar: {
    mood_date: (parent) =>
      parent.mood_date ? new Date(parent.mood_date).toISOString() : null,
    created_at: (parent) =>
      parent.created_at ? new Date(parent.created_at).toISOString() : null,
  },
};

module.exports = moodCalendarResolvers;
