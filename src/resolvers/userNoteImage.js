const db = require('../models');
const { UserNoteImage, UserNote, Users } = db;

const userNoteImageResolvers = {
  Query: {
    getUserNoteImageById: async (_, { id }) => {
      try {
        return await UserNoteImage.findByPk(id, {
          include: [
            {
              model: UserNote,
              as: 'note',
              include: [{ model: Users, as: 'user', attributes: ['id', 'email', 'name'] }],
            },
          ],
        });
      } catch (err) {
        console.error('getUserNoteImageById error:', err);
        throw new Error('Internal Server Error');
      }
    },

    // ดึงรูปภาพโน้ตทั้งหมดของ user (join ผ่าน user_note.user_id)
    getUserNoteImageByUserId: async (_, { user_id }) => {
      try {
        return await UserNoteImage.findAll({
          include: [
            {
              model: UserNote,
              as: 'note',
              required: true, // ต้องมี note และ note.user_id ตรง
              where: { user_id },
              include: [{ model: Users, as: 'user', attributes: ['id', 'email', 'name'] }],
            },
          ],
          order: [['created_at', 'DESC']],
        });
      } catch (err) {
        console.error('getUserNoteImageByUserId error:', err);
        throw new Error('Internal Server Error');
      }
    },
  },

  Mutation: {
    createUserNoteImage: async (_, { input }) => {
      try {
        const { user_note_id, img_url } = input;

        const created = await UserNoteImage.create({
          user_note_id: user_note_id ?? null,
          img_url: img_url ?? null,
          created_at: new Date(),
        });

        return await UserNoteImage.findByPk(created.id, {
          include: [
            {
              model: UserNote,
              as: 'note',
              include: [{ model: Users, as: 'user', attributes: ['id', 'email', 'name'] }],
            },
          ],
        });
      } catch (err) {
        console.error('createUserNoteImage error:', err);
        throw new Error('Internal Server Error');
      }
    },
  },

  UserNoteImage: {
    created_at: (parent) =>
      parent.created_at ? new Date(parent.created_at).toISOString() : null,
  },
};

module.exports = userNoteImageResolvers;
