module.exports = (sequelize, DataTypes) => {
  const UserNote = sequelize.define(
    "UserNote",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      note_text: { type: DataTypes.TEXT, allowNull: true },
      note_date: { type: DataTypes.DATEONLY, allowNull: false },
      created_at: { type: DataTypes.DATE },
    },
    {
      tableName: "user_note",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "note_date"],
          name: "ux_user_note_userid_note_date",
        },
      ],
    }
  );

  UserNote.associate = (models) => {
    UserNote.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
    UserNote.hasMany(models.UserNoteImage, {
      foreignKey: "user_note_id",
      as: "images",
    });
  };

  return UserNote;
};
