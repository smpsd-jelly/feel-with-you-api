const { gql } = require("apollo-server-express");

module.exports = gql`    
    type Config {
        id: Int!
        config_code: String!
        config_value: String
        config_name_th: String
        config_name_en: String
        created_at: String
        updated_at: String
    }
    type Query {
        getConfigById(id: Int!): Config
        getConfigByCode(config_code: String!): [Config]
    }
`;
