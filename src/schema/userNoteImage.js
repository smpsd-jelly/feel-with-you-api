// src/schema/userNoteImage.js
const gql = require('graphql-tag');

module.exports = gql`
  scalar Upload

  type UserNoteImage {
    id: Int!
    user_note_id: Int
    img_url: String
    created_at: String
    note: UserNote
  }

  type Query {
    getUserNoteImageById(id: Int!): UserNoteImage
    getUserNoteImageByUserId(user_id: Int!): [UserNoteImage!]!
  }

  type Mutation {
    createUserNoteImages(
      user_note_id: Int!
      files: [Upload!]!
    ): [UserNoteImage!]!
    deleteUserNoteImage(id: Int!): Boolean!
    updateUserNoteImages(
      user_note_id: Int!
      files: [Upload!]!
    ): [UserNoteImage!]!
  }
`;
