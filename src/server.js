const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema'); 
const resolvers = require('./resolvers'); 
const db = require('./models'); 

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { req };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  db.sequelize.sync().then(() => {
    app.listen({ port: 4000 }, () => {
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
  });
}

module.exports = startServer;
