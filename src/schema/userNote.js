const { gql } = require("apollo-server-express");

module.exports = gql`
  type UserNote {
    id: Int!
    user_id: Int!
    note_text: String
    note_date: String
    created_at: String
    user: User
    images: [UserNoteImage!]!
  }

  input CreateUserNoteInput {
    user_id: Int!
    note_text: String
    note_date: String
  }

  type Query {
    getUserNoteById(id: Int!): UserNote
    getUserNoteByUserId(user_id: Int!): [UserNote]
    getUserNoteByUserAndDate(user_id: Int!, note_date: String!): UserNote
    getUserNotesByUserAndRange(
      user_id: Int!
      start: String!
      end: String!
    ): [UserNote!]!
  }

  type Mutation {
    createUserNote(input: CreateUserNoteInput!): UserNote!
    deleteUserNote(id: Int!): Boolean!
    updateUserNote(id: Int!, note_text: String): UserNote
  }
`;
