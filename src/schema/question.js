const gql = require('graphql-tag');

module.exports = gql`
  type Question {
    id: Int!
    question_detail: String!
    status: String
    created_at: String
    updated_at: String
  }

  type Query {
    getAllQuestion: [Question!]!
    getQuestionById(id: Int!): Question
  }
`;
