const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("@apollo/server/plugin/landingPage/default");

const { graphqlUploadExpress, GraphQLUpload } = require("graphql-upload-ts");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const db = require("./models");

require("dotenv").config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // ---------- Static ----------
  const IMAGES_ROOT = path.join(process.cwd(), "images");
  app.use("/images", express.static(IMAGES_ROOT, { fallthrough: false }));

  const UPLOAD_ROOT = path.join(process.cwd(), "public", "upload");
  if (!fs.existsSync(UPLOAD_ROOT))
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  app.use("/uploads", express.static(UPLOAD_ROOT));

  // ---------- CORS ----------
  const corsOptions = {
    origin: [
      "http://localhost:3000",
      "https://studio.apollographql.com",
      process.env.FRONTEND_URL || "*",
    ],
    credentials: true,
  };

  // IMPORTANT: upload middleware ต้องมาก่อน expressMiddleware
  app.use(
    "/graphql",
    cors(corsOptions),
    graphqlUploadExpress({ maxFileSize: 20 * 1024 * 1024, maxFiles: 10 }),
    express.json({ limit: "10mb" })
  );

  // ---------- Apollo Server v4 ----------
  const server = new ApolloServer({
    typeDefs,
    resolvers: { Upload: GraphQLUpload, ...resolvers },
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  const PORT = process.env.PORT || 4000;

  console.log("Attempting to connect to the database...");


  try {
    await db.sequelize.sync();
    console.log("Database connected!");
 
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server ready at http://0.0.0.0:${PORT}/graphql`);
  } catch (err) {
    console.error("Database Connection Failed:", err);
    process.exit(1);
  }
}

if (require.main === module) startServer();
module.exports = startServer;
