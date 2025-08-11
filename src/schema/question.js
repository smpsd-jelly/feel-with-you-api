const { gql } = require("apollo-server-express");

module.exports = gql`
  type Question {
    id: Int!
    question_detail: String!
    status: Int
    created_at: String
    updated_at: String
  }

  type Query {
    getAllQuestion: [Question!]!
    getQuestionById(id: Int!): Question
  }
`;
