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

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://studio.apollographql.com",
        process.env.FRONTEND_URL || "*"
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

  console.log("Attempting to connect to the database...");

  db.sequelize.sync()
    .then(() => {
      console.log("Database connected!"); 
      app.listen({ port: PORT }, () => {
        console.log(`Server ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
      });
    })
    .catch((err) => {  
      console.error(" Database Connection Failed:", err);
      process.exit(1); 
    });
}

module.exports = startServer;