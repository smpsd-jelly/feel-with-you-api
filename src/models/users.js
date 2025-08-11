module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      level: {
        type: DataTypes.INTEGER,
      },
      first_login: {
        type: DataTypes.DATE,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  Users.associate = (models) => {
    Users.hasMany(models.UserQuestionAnswer, {
      foreignKey: "user_id",
      as: "answers",
    });
    Users.hasMany(models.MoodCalendar, {
      foreignKey: "user_id",
      as: "moodCalendars",
    });
    Users.hasMany(models.UserNote, {
      foreignKey: "user_id",
      as: "notes",
    });
  };

  return Users;
};
