const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const crypto = require("crypto");
const db = require("../models");
const { UserNoteImage, UserNote, Users } = db;
const { toThaiISOString, now } = require("../../helper/thThime");

const NOTES_DIR = path.join(process.cwd(), "public", "upload", "notes");

async function ensureDir() {
  await fsp.mkdir(NOTES_DIR, { recursive: true });
}

async function saveUploadToDisk(upload) {
  const { filename, createReadStream } = await upload;
  await ensureDir();

  const ext = path.extname(filename || "").toLowerCase() || ".bin";
  const unique = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const filePath = path.join(NOTES_DIR, unique);

  await new Promise((resolve, reject) => {
    const stream = createReadStream();
    const out = fs.createWriteStream(filePath);
    stream
      .on("error", reject)
      .pipe(out)
      .on("error", reject)
      .on("finish", resolve);
  });

  const publicUrl = `/uploads/notes/${unique}`;
  return publicUrl;
}

const userNoteImageResolvers = {
  Query: {
    getUserNoteImageById: async (_, { id }) => {
      return await UserNoteImage.findByPk(id, {
        include: [
          {
            model: UserNote,
            as: "note",
            include: [
              { model: Users, as: "user", attributes: ["id", "email", "name"] },
            ],
          },
        ],
      });
    },
    getUserNoteImageByUserId: async (_, { user_id }) => {
      return await UserNoteImage.findAll({
        include: [
          {
            model: UserNote,
            as: "note",
            required: true,
            where: { user_id },
            include: [
              { model: Users, as: "user", attributes: ["id", "email", "name"] },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
      });
    },
  },

  Mutation: {
    createUserNoteImages: async (_, { user_note_id, files }) => {
      if (!user_note_id) throw new Error("user_note_id is required");
      if (!files || files.length === 0) throw new Error("No files provided");

      const current = await UserNoteImage.count({ where: { user_note_id } });
      const room = Math.max(0, 3 - current);
      if (room <= 0) throw new Error("This note already has 3 images.");

      const useFiles = files.slice(0, room);
      const results = [];

      for (const f of useFiles) {
        const img_url = await saveUploadToDisk(f);
        const created = await UserNoteImage.create({
          user_note_id,
          img_url,
          created_at: now(),
        });

        const row = await UserNoteImage.findByPk(created.id, {
          include: [
            {
              model: UserNote,
              as: "note",
              include: [
                {
                  model: Users,
                  as: "user",
                  attributes: ["id", "email", "name"],
                },
              ],
            },
          ],
        });
        results.push(row);
      }

      return results;
    },

    // ลบรูปเดี่ยว ๆ
    deleteUserNoteImage: async (_, { id }) => {
      try {
        const deleted = await UserNoteImage.destroy({
          where: { id },
        });
        return deleted > 0;
      } catch (err) {
        console.error("deleteUserNoteImage error:", err);
        throw new Error("Internal Server Error");
      }
    },
    updateUserNoteImages: async (_, { user_note_id, files }) => {
      if (!user_note_id) throw new Error("user_note_id is required");
      if (!files || files.length === 0) throw new Error("No files provided");

      const current = await UserNoteImage.count({ where: { user_note_id } });
      const room = Math.max(0, 3 - current);
      if (room <= 0) throw new Error("This note already has 3 images.");

      const useFiles = files.slice(0, room);
      const results = [];

      for (const f of useFiles) {
        const img_url = await saveUploadToDisk(f);
        const created = await UserNoteImage.create({
          user_note_id,
          img_url,
          created_at: now(),
        });
        results.push(created);
      }

      // คืนค่า row ล่าสุดพร้อมข้อมูลสำคัญ
      return await UserNoteImage.findAll({
        where: { user_note_id },
        order: [["created_at", "ASC"]],
      });
    },
  },

  UserNoteImage: {
    created_at: (p) => toThaiISOString(p.created_at),
  },
};

module.exports = userNoteImageResolvers;
