const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress, GraphQLUpload } = require("graphql-upload-ts");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const db = require("./models");

async function startServer() {
  const app = express();

  const IMAGES_ROOT = path.join(process.cwd(), "images");
  app.use("/images", express.static(IMAGES_ROOT, { fallthrough: false }));

  const UPLOAD_ROOT = path.join(process.cwd(), "public", "upload");
  app.use("/uploads", express.static(UPLOAD_ROOT));

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
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
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql", cors: false });

  db.sequelize.sync().then(() => {
    app.listen({ port: 4000 }, () => {
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
      console.log(`Static uploads at http://localhost:4000/uploads`);
    });
  });
}

module.exports = startServer;
