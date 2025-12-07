module.exports = (sequelize, DataTypes) => {
    const Config = sequelize.define(
        "Config",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            config_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            config_value: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            config_name_th: {
                type: DataTypes.STRING,
            },
            config_name_en: {
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            tableName: "config",
            timestamps: false, // handle created_at/updated_at manually above
        }
    );

    Config.associate = (models) => {
        Config.hasMany(models.Question, {
            foreignKey: "config_value",
            as: "question",
        });
        Config.hasMany(models.UserQuestionAnswer, {
            foreignKey: "config_value",
            as: "userQuestionAnswer_status",
        });
        Config.hasMany(models.UserQuestionAnswer, {
            foreignKey: "config_value",
            as: "userQuestionAnswer_score",
        });
    };

    return Config;
};