module.exports = (sequelize, DataTypes) => {
  const UserQuestionAnswer = sequelize.define(
    "UserQuestionAnswer",
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
      status: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "user_question_answer",
      timestamps: false,
    }
  );

  UserQuestionAnswer.associate = (models) => {
    UserQuestionAnswer.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  
  return UserQuestionAnswer;
};
