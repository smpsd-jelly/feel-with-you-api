const db = require("../models");
const { UserNote, Users } = db;

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
  },

  Mutation: {
    createUserNote: async (_, { input }) => {
      try {
        const { user_id, note_text, note_date } = input;

        const created = await UserNote.create({
          user_id,
          note_text: note_text ?? null,
          note_date: note_date ? new Date(note_date) : null,
          created_at: new Date(),
        });

        // คืนค่าพร้อม include user
        return await UserNote.findByPk(created.id, {
          include: [
            {
              model: db.Users,
              as: "user",
              attributes: ["id", "email", "name"],
            },
          ],
        });
      } catch (err) {
        console.error("createUserNote error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },

  // แปลงวันที่เป็น ISO string (ถ้าต้องการ)
  UserNote: {
    note_date: (parent) =>
      parent.note_date ? new Date(parent.note_date).toISOString() : null,
    created_at: (parent) =>
      parent.created_at ? new Date(parent.created_at).toISOString() : null,
  },
};

module.exports = userNoteResolvers;
