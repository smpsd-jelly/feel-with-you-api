const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const cors = require('cors');
const path = require('path');
const db = require('./models');
const fs = require('fs');

async function startServer() {
  const app = express();

  const IMAGES_DIR = path.resolve(process.cwd(), 'images');
  app.use('/images', express.static(IMAGES_DIR));
  app.get('/__debug_static', (req, res) => {
    res.json({
      cwd: process.cwd(),
      IMAGES_DIR,
      exists: fs.existsSync(IMAGES_DIR),
      files: fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : [],
    });
  });

  // ✅ อนุญาต origin ของ Next.js และ Apollo Studio
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://studio.apollographql.com',
    ],
    credentials: true,
  }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // ✅ ให้ Studio อ่านสคีมาได้
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  db.sequelize.sync().then(() => {
    app.listen({ port: 4000 }, () => {
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
  });
}

module.exports = startServer;
