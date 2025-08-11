const { gql } = require('apollo-server-express');

module.exports = gql`
  type MoodMusic {
    id: Int!
    mood_id: Int!
    music_url: String!
    created_at: String
    mood: Mood
  }

  type Query {
    getAllMoodMusic: [MoodMusic!]!
  }
`;
