module.exports = (sequelize, DataTypes) => {
  const MoodCalendar = sequelize.define(
    "MoodCalendar",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      mood_id: { type: DataTypes.INTEGER, allowNull: false },
      mood_date: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE },
    },
    {
      tableName: "mood_calendar",
      timestamps: false,
    }
  );

  MoodCalendar.associate = (models) => {
    // 1 user -> many mood_calendar
    MoodCalendar.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });

    // 1 mood -> many mood_calendar
    MoodCalendar.belongsTo(models.Mood, {
      foreignKey: "mood_id",
      as: "mood",
    });
  };

  return MoodCalendar;
};
