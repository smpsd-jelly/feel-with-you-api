module.exports = (sequelize, DataTypes) => {
  const MoodMusic = sequelize.define(
    'MoodMusic',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      mood_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      music_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'mood_music',
      timestamps: false,
    }
  );

  MoodMusic.associate = (models) => {
    MoodMusic.belongsTo(models.Mood, {
      foreignKey: 'mood_id',
      as: 'mood',
    });
  };

  return MoodMusic;
};
