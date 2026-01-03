const db = require("../models");
const { Op } = require("sequelize");
const { UserNote, Users, UserNoteImage } = db;
const {
  toThaiISOString,
  normalizeThaiDayRange,
  now,
} = require("../../helper/thThime");

const userNoteResolvers = {
  Query: {
    getUserNoteById: async (_, { id }) => {
      try {
        return await UserNote.findByPk(id, {
          include: [
            { model: Users, as: "user", attributes: ["id", "email", "name"] },
          ],
        });
      } catch (err) {
        console.error("getUserNoteById error:", err);
        throw new Error("Internal Server Error");
      }
    },
    getUserNoteByUserAndDate: async (_, { user_id, note_date }) => {
      try {
        return await UserNote.findOne({
          where: { user_id, note_date },
          include: [
            { model: Users, as: "user", attributes: ["id", "email", "name"] },
          ],
        });
      } catch (err) {
        console.error("getUserNoteByUserAndDate error:", err);
        throw new Error("Internal Server Error");
      }
    },
    getUserNotesByUserAndRange: async (_, { user_id, start, end }) => {
      return await UserNote.findAll({
        where: {
          user_id,
          note_date: { [Op.between]: [start, end] },
        },
        include: [
          { model: Users, as: "user", attributes: ["id", "email", "name"] },
          {
            model: UserNoteImage,
            as: "images",
            attributes: ["id", "img_url", "created_at"],
          },
        ],
        order: [
          ["note_date", "DESC"],
          ["created_at", "DESC"],
        ],
      });
    },
    hasAnyUserNote: async (_, { user_id }) => {
      try {
        const count = await UserNote.count({ where: { user_id } });
        return count > 0;
      } catch (err) {
        console.error("hasAnyUserNote error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  Mutation: {
    createUserNote: async (_, { input }) => {
      const { user_id, note_text, note_date } = input;

      const { start } = normalizeThaiDayRange(note_date ?? now());
      const todayStr = toThaiISOString(start).slice(0, 10);

      try {
        // เงื่อนไขระดับ app
        const existing = await UserNote.findOne({
          where: { user_id, note_date: todayStr },
        });
        if (existing) {
          throw new Error("You already created a note for today.");
        }

        const created = await UserNote.create({
          user_id,
          note_text: note_text ?? null,
          note_date: todayStr,
          created_at: now,
        });

        return await UserNote.findByPk(created.id, {
          include: [
            {
              model: Users,
              as: "user",
              attributes: ["id", "email", "name"],
            },
          ],
        });
      } catch (err) {
        console.error("createUserNote error:", err);

        // กันกรณี unique constraint จาก DB ระดับล่างด้วย
        if (err.name === "SequelizeUniqueConstraintError") {
          throw new Error("You already created a note for today.");
        }

        throw new Error("Internal Server Error");
      }
    },
    deleteUserNote: async (_, { id }) => {
      try {
        const note = await UserNote.findByPk(id);
        if (!note) {
          return false;
        }

        // ลบรูปทั้งหมดที่ผูกกับ note นี้
        await UserNoteImage.destroy({
          where: { user_note_id: id },
        });

        await UserNote.destroy({
          where: { id },
        });

        return true;
      } catch (err) {
        console.error("deleteUserNote error:", err);
        throw new Error("Internal Server Error");
      }
    },
    updateUserNote: async (_, { id, note_text }) => {
      try {
        const note = await UserNote.findByPk(id);
        if (!note) throw new Error("Note not found");

        await UserNote.update(
          { note_text: note_text ?? null },
          { where: { id } }
        );

        return await UserNote.findByPk(id, {
          include: [
            { model: Users, as: "user", attributes: ["id", "email", "name"] },
          ],
        });
      } catch (err) {
        console.error("updateUserNote error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  UserNote: {
    note_date: (p) =>
      p.note_date ? new Date(p.note_date).toISOString() : null,
    created_at: (p) => toThaiISOString(p.created_at),

    images: async (parent) => {
      return await UserNoteImage.findAll({
        where: { user_note_id: parent.id },
        order: [["created_at", "ASC"]],
      });
    },
    user: async (parent) => {
      if (parent.user) return parent.user;
      return await Users.findByPk(parent.user_id, {
        attributes: ["id", "email", "name"],
      });
    },
  },
};

module.exports = userNoteResolvers;
