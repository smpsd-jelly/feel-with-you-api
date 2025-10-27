'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('mood', [
      {
        id: 1,
        name: 'happy',
        img_url: '/images/EmotionPic/emotion2.png',  
      },
      {
        id: 2,
        name: 'sad',
        img_url: '/images/EmotionPic/emotion3.png',
      },
      {
        id: 3,
        name: 'angry',
        img_url: '/images/EmotionPic/emotion4.png',
      },
      {
        id: 4,
        name: 'gloomy',
        img_url: '/images/EmotionPic/emotion1.png',
      },
       {
        id: 5,
        name: 'default',
        img_url: '/images/EmotionPic/cloud-default.png',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mood', null, {});
  }
};

