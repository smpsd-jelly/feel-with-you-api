const { gql } = require('apollo-server-express');

module.exports = gql`
  type UserNoteImage {
    id: Int!
    user_note_id: Int
    img_url: String
    created_at: String
    note: UserNote
  }

  input CreateUserNoteImageInput {
    user_note_id: Int 
    img_url: String!
  }

  type Query {
    getUserNoteImageById(id: Int!): UserNoteImage
    getUserNoteImageByUserId(user_id: Int!): [UserNoteImage!]!
  }

  type Mutation {
    createUserNoteImage(input: CreateUserNoteImageInput!): UserNoteImage!
  }
`;
