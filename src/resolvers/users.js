const db = require("../models");
const { Users } = db
const userResolvers = {
  Query: {
    getUserById: async (_, { id }) => {
      try {
        const user = await Users.findByPk(id);
        return user;
      } catch (err) {
        console.error("getUserById error:", err);
        throw new Error("Internal Server Error");
      }
    },
  },
  Mutation: {
    addUser: async (_, { email, name, level }) => {
      return await db.Users.create({
        email,
        name,
        level,
        first_login: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    },
  },
};

module.exports = userResolvers;
