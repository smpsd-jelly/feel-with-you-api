const { gql } = require("apollo-server-express");

module.exports = gql`
  type UserQuestionAnswer {
    id: Int!
    user_id: Int!
    status: Int
    created_at: String
    updated_at: String
  }

  type AnswerCount {
    status: Int!
    count: Int!
  }

  type UserAnswerStats {
    user_id: Int!
    total: Int!
    breakdown: [AnswerCount!]!
    mostCommonStatus: Int
    mostCommonCount: Int
  }

  type Query {
    getAllUserQuestionAnswers(user_id: Int): [UserQuestionAnswer!]!
    #นับแต่ละ status และบอกว่าอันไหนมากสุด
    getUserAnswerStats(user_id: Int!): UserAnswerStats!
  }
`;
