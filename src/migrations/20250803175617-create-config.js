'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('config', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      config_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      config_value: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      config_name_th: {
        type: Sequelize.STRING,
      },
      config_name_en: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('config');
  },
};

