module.exports = (sequelize, DataTypes) => {
  const UserQuestionScores = sequelize.define(
    "UserQuestionScores",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "user_question_scores",
      timestamps: false,
    }
  );

  UserQuestionScores.associate = (models) => {
    UserQuestionScores.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return UserQuestionScores;
};