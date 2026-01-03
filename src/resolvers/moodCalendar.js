const db = require("../models");
const { Op } = require("sequelize");
const { MoodCalendar, Users, Mood } = db;

const {
  normalizeThaiDayRange,
  toThaiISOString,
  toDateAssumingThai,
  now,
} = require("../../helper/thThime");

const moodCalendarResolvers = {
  Query: {
    getMoodCalendarByUserId: async (_, { user_id, start, end }) => {
      try {
        const where = { user_id };

        if (start && end) {
          where.mood_date = {
            [Op.gte]: toDateAssumingThai(start),
            [Op.lt]: toDateAssumingThai(end),
          };
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
          include: [{ model: Users, as: "user", attributes: ["id", "email", "name"] }],
        });
      } catch (err) {
        console.error("getUserNoteByUserId error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  Mutation: {
    createMoodCalendarByDay: async (_, { input }) => {
      const { user_id, mood_id, mood_date } = input;
      const queryRunner = await db.sequelize.transaction();

      try {
        const { start, end } = normalizeThaiDayRange(mood_date);

        const existing = await MoodCalendar.findOne({
          where: {
            user_id,
            mood_date: { [Op.gte]: start, [Op.lt]: end },
          },
          transaction: queryRunner,
          lock: queryRunner.LOCK.UPDATE,
        });

        let result;
        if (existing) {
          await existing.update(
            {
              mood_id,
              updated_at: now(),
            },
            { transaction: queryRunner }
          );

          result = await MoodCalendar.findByPk(existing.id, {
            include: [
              { model: db.Users, as: "user", attributes: ["id", "email", "name"] },
              { model: db.Mood, as: "mood" },
            ],
            transaction: queryRunner,
          });
        } else {
          const created = await MoodCalendar.create(
            {
              user_id,
              mood_id,
              mood_date: mood_date ? toDateAssumingThai(mood_date) : now(),
              created_at: now(),
            },
            { transaction: queryRunner }
          );

          result = await MoodCalendar.findByPk(created.id, {
            include: [
              { model: db.Users, as: "user", attributes: ["id", "email", "name"] },
              { model: db.Mood, as: "mood" },
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
    mood_date: (parent) => toThaiISOString(parent.mood_date),
    created_at: (parent) => toThaiISOString(parent.created_at),
    updated_at: (parent) => toThaiISOString(parent.updated_at),
  },
};

module.exports = moodCalendarResolvers;
