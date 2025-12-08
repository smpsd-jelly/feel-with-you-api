const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress, GraphQLUpload } = require("graphql-upload-ts");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const db = require("./models");
require('dotenv').config();

async function startServer() {
  const app = express();

  const IMAGES_ROOT = path.join(process.cwd(), "images");
  app.use("/images", express.static(IMAGES_ROOT, { fallthrough: false }));

  const UPLOAD_ROOT = path.join(process.cwd(), "public", "upload");
  // Ensure upload directory exists to prevent startup errors
  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  }
  app.use("/uploads", express.static(UPLOAD_ROOT));

  // --- CRITICAL CHANGE FOR PRODUCTION ---
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://studio.apollographql.com",
        process.env.FRONTEND_URL || "*" // Allow your production frontend or ALL (*) for now
      ],
      credentials: true,
    })
  );

  app.use(
    graphqlUploadExpress({ maxFileSize: 20 * 1024 * 1024, maxFiles: 10 })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers: { Upload: GraphQLUpload, ...resolvers },
    introspection: true,
    cache: "bounded", 
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql", cors: false });

  const PORT = process.env.PORT || 4000;

  db.sequelize.sync().then(() => {
    app.listen({ port: PORT }, () => {
      console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

module.exports = startServer;