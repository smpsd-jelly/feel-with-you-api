"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // เปลี่ยน type เป็น DATEONLY
    await queryInterface.changeColumn("user_note", "note_date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("user_note", "note_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
