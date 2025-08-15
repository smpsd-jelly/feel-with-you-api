const db = require("../models");
const { Users } = db;
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
    getUserByEmail: async (_, { email }) => {
      return await Users.findOne({ where: { email } });
    },
  },
  Mutation: {
    addUser: async (_, { email, name }) => {
      const now = new Date();
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        throw new Error(`User with email ${email} already exists`);
      }
      const user = await Users.create({
        email,
        name: name ?? null,
        level: 1,
        created_at: now,
        updated_at: now,
      });
      return user;
    },

    updateUser: async (_, { email, name, first_login }) => {
      const now = new Date();
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      await user.update({
        name: name ?? user.name,
        first_login: first_login ? now : user.first_login,
        updated_at: now,
      });
      return user;
    },
  },
};

module.exports = userResolvers;
