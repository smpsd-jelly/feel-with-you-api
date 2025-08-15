const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: Int!
    email: String!
    name: String
    level: Int
    first_login: String
    created_at: String
    updated_at: String
  }

  type Query {
    getUserById(id: Int!): User
    getUserByEmail(email: String!): User
  }

  type Mutation {
    addUser(email: String!, name: String): User
    updateUser(email: String!, name: String, first_login: String): User
  }
`;
