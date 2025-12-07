"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "mood_music",
      [
        // mood_id = 1 (happy)
        // 1. จังหวะจะรัก
        {
          mood_id: 1,
          music_url: "https://www.youtube.com/watch?v=URNttPi5Iio",
          created_at: now,
        },
        // 2. Melbourne
        {
          mood_id: 1,
          music_url: "https://www.youtube.com/watch?v=BjBXoSX5aQI",
          created_at: now,
        },
        // 3. หวานใจผมน่ารักกว่าใคร
        {
          mood_id: 1,
          music_url: "https://www.youtube.com/watch?v=Q9TaigJz6ik",
          created_at: now,
        },
        // 4. เพลงรัก
        {
          mood_id: 1,
          music_url: "https://www.youtube.com/watch?v=OYPiXBIgvJ8",
          created_at: now,
        },
        // 5. เพลงรักเพลงแรก
        {
          mood_id: 1,
          music_url: "https://www.youtube.com/watch?v=N9bashij_7c",
          created_at: now,
        },

        // mood_id = 4 (gloomy)
        // 1. นิทาน
        {
          mood_id: 4,
          music_url: "https://www.youtube.com/watch?v=Ik228UkBp6w",
          created_at: now,
        },
        // 2. MUSKETEERS
        {
          mood_id: 4,
          music_url: "https://www.youtube.com/watch?v=VEWrvDW3Z8w",
          created_at: now,
        },
        // 3. ฉันคือดวงจันทร์
        {
          mood_id: 4,
          music_url: "https://www.youtube.com/watch?v=jCPM-r10T28",
          created_at: now,
        },
        // 4. เหมือนวิวาห์
        {
          mood_id: 4,
          music_url: "https://www.youtube.com/watch?v=7lKLFVHAQMo",
          created_at: now,
        },
        // 5. ลมแล้ง
        {
          mood_id: 4,
          music_url: "https://www.youtube.com/watch?v=E_wrJhXm7jo",
          created_at: now,
        },

        // mood_id = 3 (angry)
        // 1. เท่านี้ที่อยากฟัง
        {
          mood_id: 3,
          music_url: "https://www.youtube.com/watch?v=Xothp7j9i2I",
          created_at: now,
        },
        // 2. ช่วงนี้
        {
          mood_id: 3,
          music_url: "https://www.youtube.com/watch?v=9OmzHSLehHc",
          created_at: now,
        },
        // 3. จักรวาลไหน
        {
          mood_id: 3,
          music_url: "https://www.youtube.com/watch?v=FxFPSs71FSI",
          created_at: now,
        },
        // 4. ฉันเป็นทะเล
        {
          mood_id: 3,
          music_url: "https://www.youtube.com/watch?v=zkc0B2QbFCg",
          created_at: now,
        },
        // 5. โกหก
        {
          mood_id: 3,
          music_url: "https://www.youtube.com/watch?v=OTSs4gSXl6w",
          created_at: now,
        },

        // mood_id = 2 (sad)
        // 1. สักวันฉันจะหายดี
        {
          mood_id: 2,
          music_url: "https://www.youtube.com/watch?v=qyKVXta1vVY",
          created_at: now,
        },
        // 2. ดวงใจ
        {
          mood_id: 2,
          music_url: "https://www.youtube.com/watch?v=ZHHl28Lxqww",
          created_at: now,
        },
        // 3. โลกที่แบกไว้
        {
          mood_id: 2,
          music_url: "https://www.youtube.com/watch?v=RiZ2N3A5siI",
          created_at: now,
        },
        // 4. เธอน่ะไม่ต้องเก่งกว่านี้
        {
          mood_id: 2,
          music_url: "https://www.youtube.com/watch?v=NBweXyr4kUM",
          created_at: now,
        },
        // 5. ธรรมดาที่แสนพิเศษ
        {
          mood_id: 2,
          music_url: "https://www.youtube.com/watch?v=h2VIUdst5y4",
          created_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // ลบเฉพาะข้อมูลที่เรา seed เข้าไป (ตาม mood_id ทั้ง 4 mood)
    await queryInterface.bulkDelete("mood_music", {
      mood_id: { [Sequelize.Op.in]: [1, 2, 3, 4] },
    });
  },
};
