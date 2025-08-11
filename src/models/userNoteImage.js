// models/UserNoteImage.js
module.exports = (sequelize, DataTypes) => {
  const UserNoteImage = sequelize.define(
    'UserNoteImage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_note_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      img_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'user_note_image',
      timestamps: false,
    }
  );

  UserNoteImage.associate = (models) => {
    UserNoteImage.belongsTo(models.UserNote, {
      foreignKey: 'user_note_id',
      as: 'note',
    });
  };

  return UserNoteImage;
};
