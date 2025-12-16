const gql = require('graphql-tag');

module.exports = gql`
  type UserQuestionAnswer {
    id: Int!
    user_id: Int!
    question_id: Int!         # Added to match migration
    question_status: String!  # Renamed from 'status', Type changed to String
    question_score: String!   # Added to match migration
    created_at: String
    updated_at: String
  }

  # For the statistics breakdown
  type AnswerCount {
    status: String!           # Type changed to String
    count: Int!
  }

  type UserAnswerStats {
    user_id: Int!
    total: Int!
    breakdown: [AnswerCount!]!
    mostCommonStatus: String  # Type changed to String
    mostCommonCount: Int
  }

  type Query {
    getAllUserQuestionAnswers(user_id: Int): [UserQuestionAnswer!]!
    # Counts by 'question_status' and finds the most common one
    getUserAnswerStats(user_id: Int!): UserAnswerStats!
  }

  # Define the shape of a single answer input
  input QuestionAnswerInput {
    question_id: Int!
    question_status: String!
    question_score: String!
  }

  type Mutation {
    # Update mutation to accept 'answers' as a List ([]) of inputs
    addBulkUserQuestionAnswers(
      user_id: Int!
      answers: [QuestionAnswerInput!]! 
    ): [UserQuestionAnswer!]!
  }
`;