const gql = require('graphql-tag');


module.exports = gql`
  type Mood {
    id: Int!
    name: String!
    img_url: String
  }

  type Query {
    getMoodById(id: Int!): Mood
    getMoodByName(name: String!): Mood
    getDefaultMood: Mood
    moods: [Mood!]!
  }
    
`;
