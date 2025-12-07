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
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "question",
          key: "id",
        },
      },
      question_status: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "config",
          key: "config_value",
        },
      },
      question_score: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "config",
          key: "config_value",
        },
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
    UserQuestionAnswer.belongsTo(models.Question, {
      foreignKey: "question_id",
      as: "question",
    });
    UserQuestionAnswer.belongsTo(models.Config, {
      foreignKey: "question_status",
      as: "config_value_status",
    });
    UserQuestionAnswer.belongsTo(models.Config, {
      foreignKey: "question_score",
      as: "config_value_score",
    });
  };

  return UserQuestionAnswer;
};
