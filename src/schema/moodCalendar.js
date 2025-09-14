const { gql } = require('apollo-server-express');

module.exports = gql`
  type Mood {
    id: Int!
    name: String!
    img_url: String
  }

  type MoodCalendar {
    id: Int!
    user_id: Int!
    mood_id: Int!
    mood_date: String!
    created_at: String
    user: User
    mood: Mood
  }

  input CreateMoodCalendarByDayInput {
    user_id: Int!
    mood_id: Int!
    mood_date: String!
  }

  type Query {
    getMoodCalendarByUserId(
      user_id: Int!
      start: String
      end: String
    ): [MoodCalendar!]!
  }

  type Mutation {
    createMoodCalendarByDay(input: CreateMoodCalendarByDayInput!): MoodCalendar!
  }
`;
