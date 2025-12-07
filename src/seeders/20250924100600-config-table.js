'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    try {
      // clear any existing data with this code to prevent conflicts
      await queryInterface.bulkDelete('config', {
        config_code: 'QUESTION_SCORE'
      }, {});

      // Insert new data WITHOUT the 'id' field
      await queryInterface.bulkInsert('config', [
        {
          // id: 1,  <-- REMOVED
          config_code: 'QUESTION_SCORE',
          config_value: '1',
          config_name_th: 'คะแนนจากคำถาม',
          config_name_en: 'Question Score',
          created_at: now,
          updated_at: now
        },
        {
          // id: 2,  <-- REMOVED
          config_code: 'QUESTION_SCORE',
          config_value: '2',
          config_name_th: 'คะแนนจากคำถาม',
          config_name_en: 'Question Score',
          created_at: now,
          updated_at: now
        },
        {
          // id: 3,  <-- REMOVED
          config_code: 'QUESTION_SCORE',
          config_value: '3',
          config_name_th: 'คะแนนจากคำถาม',
          config_name_en: 'Question Score',
          created_at: now,
          updated_at: now
        },
        {
          // id: 4,  <-- REMOVED
          config_code: 'QUESTION_GROUP',
          config_value: 'GROUP_1',
          config_name_th: 'กลุ่มคำถาม 1',
          config_name_en: 'Question Group 1',
          created_at: now,
          updated_at: now
        },
        {
          // id: 5,  <-- REMOVED
          config_code: 'QUESTION_GROUP',
          config_value: 'GROUP_2',
          config_name_th: 'กลุ่มคำถาม 2',
          config_name_en: 'Question Group 2',
          created_at: now,
          updated_at: now
        },
        {
          // id: 6,  <-- REMOVED
          config_code: 'QUESTION_GROUP',
          config_value: 'GROUP_3',
          config_name_th: 'กลุ่มคำถาม 3',
          config_name_en: 'Question Group 3',
          created_at: now,
          updated_at: now
        },
        {
          // id: 7,  <-- REMOVED
          config_code: 'QUESTION_GROUP',
          config_value: 'GROUP_4',
          config_name_th: 'กลุ่มคำถาม 4',
          config_name_en: 'Question Group 4',
          created_at: now,
          updated_at: now
        },
      ], {});

      console.log("Seeding completed successfully.");

    } catch (error) {
      // Print the ACTUAL error message if it fails
      console.error("SEEDER ERROR:", error.original ? error.original.sqlMessage : error.message);
      throw error;
    }
  },

async down(queryInterface, Sequelize) {
    // Delete BOTH types of configs you added
    await queryInterface.bulkDelete('config', {
      config_code: {
        [Sequelize.Op.in]: ['QUESTION_SCORE', 'QUESTION_GROUP']
      }
    }, {});
  }
};