const gql = require('graphql-tag');

module.exports = gql`
  type UserScoreResult {
    id: Int!
    user_id: Int!
    total_score: Int!
    created_at: String
    updated_at: String
  }

  type Query {
    getUserScore(user_id: Int!): UserScoreResult
  }

  type Mutation {
    saveUserScore(user_id: Int!): UserScoreResult
  }
`;