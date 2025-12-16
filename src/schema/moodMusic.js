const gql = require('graphql-tag');

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
    getMoodMusicByMoodId(mood_id: Int!): [MoodMusic!]!
  }
`;
