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

/** Helper: อ่าน Bearer token */
function getBearerToken(req) {
  const h = req.headers.authorization || req.headers.Authorization || "";
  if (typeof h !== "string") return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

/** Helper: enforce auth */
function assertAuth(req) {
  const expected = process.env.GRAPHQL_API_TOKEN;
  // --- DEBUG LOGS START ---
  console.log("--- DEBUG AUTH ---");
  console.log("Server Expected:", expected);
  console.log("Client Sent Header:", req.headers.authorization);
  // --- DEBUG LOGS END ---
  if (!expected) {
    // ป้องกันพลาด: ถ้าไม่ตั้งค่า token ไว้ ให้ fail ไปเลยเพื่อความปลอดภัย
    const err = new Error("Server misconfigured: GRAPHQL_API_TOKEN is missing");
    err.statusCode = 500;
    throw err;
  }

  // This line caused your error because getBearerToken was missing:
  const token = getBearerToken(req);
  if (!token || token !== expected) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  return { token };
}

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
  const allowList = new Set(
    [
      "https://studio.apollographql.com",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean)
  );

  const corsOptions = {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow non-browser tools
      if (allowList.has(origin)) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "content-type",
      "authorization",
      "apollo-require-preflight",
      "x-apollo-operation-name",
      "apollo-operation-name",
    ],
  };

  // ✅ ให้ preflight ผ่าน
  app.options("/graphql", cors(corsOptions));

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

  app.options("/graphql", cors(corsOptions));

  app.use(
    "/graphql",
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = getBearerToken(req);
        const expected = process.env.GRAPHQL_API_TOKEN;

        const auth = (token && token === expected);

        return {
          req,
          res,
          auth
        };
      },
    })
  );
  const PORT = process.env.PORT || 4000;

  console.log("Attempting to connect to the database...");

  try {
    // await db.sequelize.sync();
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
