const { gql } = require('apollo-server-express');

module.exports = gql`
  type UserNote {
    id: Int!
    user_id: Int!
    note_text: String
    note_date: String
    created_at: String
    user: User
  }

  input CreateUserNoteInput {
    user_id: Int!
    note_text: String
    note_date: String
  }

  type Query {
    getUserNoteById(id: Int!): UserNote
    getUserNoteByUserId(user_id: Int!): [UserNote] 
  }

  type Mutation {
    createUserNote(input: CreateUserNoteInput!): UserNote!
  }
`;
