module.exports = (sequelize, DataTypes) => {
  const Mood = sequelize.define(
    "Mood",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img_url: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "mood",
      timestamps: false,
    }
  );
  Mood.associate = (models) => {
    Mood.hasMany(models.MoodCalendar, {
      foreignKey: "mood_id",
      as: "moodCalendars",
    });
    Mood.hasMany(models.MoodMusic, {
      foreignKey: "mood_id",
      as: "moodmusics",
    });
  };
  return Mood;
};
