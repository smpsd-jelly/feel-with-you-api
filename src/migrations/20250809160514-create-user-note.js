"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_note", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      note_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      note_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addConstraint("user_note", {
      fields: ["user_id", "note_date"],
      type: "unique",
      name: "ux_user_note_userid_note_date",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "user_note",
      "ux_user_note_userid_note_date"
    );
    await queryInterface.removeIndex("user_note");
    await queryInterface.dropTable("user_note");
  },
};

