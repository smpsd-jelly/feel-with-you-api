const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const { ApolloServerPluginLandingPageLocalDefault } = require("@apollo/server/plugin/landingPage/default");
const { graphqlUploadExpress, GraphQLUpload } = require("graphql-upload-ts");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const db = require("./models");

require("dotenv").config();

/** Helper: Extract Bearer token */
function getBearerToken(req) {
  const h = req.headers.authorization || req.headers.Authorization || "";
  if (typeof h !== "string") return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

/** Helper: Enforce Auth */
function assertAuth(req) {
  // 1. Check for Introspection (Allow Apollo Studio to work)
  if (req.body && req.body.operationName === "IntrospectionQuery") {
    return null;
  }

  // 2. Check for Login/Register (Allow public access to get a token)
  // WARNING: Ensure your frontend sends 'operationName': 'Login' exactly!
  if (req.body && (req.body.operationName === "Login" || req.body.operationName === "Register")) {
    return null;
  }

  const expected = process.env.GRAPHQL_API_TOKEN;

  // Safety check: Server config must exist
  if (!expected) {
    throw new Error("Server misconfigured: GRAPHQL_API_TOKEN is missing");
  }

  const token = getBearerToken(req);

  // Strict Token Check
  if (!token || token !== expected) {
    // If you want to use meaningful errors, you can throw GraphQLError here instead
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  return { token };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // ---------- Static Files ----------
  const IMAGES_ROOT = path.join(process.cwd(), "images");
  app.use("/images", express.static(IMAGES_ROOT));

  const UPLOAD_ROOT = path.join(process.cwd(), "public", "upload");
  if (!fs.existsSync(UPLOAD_ROOT)) fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  app.use("/uploads", express.static(UPLOAD_ROOT));

  // ---------- CORS Configuration (Consolidated) ----------
  // Define raw origins
  const rawOrigins = [
    "https://studio.apollographql.com",
    "http://localhost:3000",
    process.env.FRONTEND_URL
  ];

  // Clean them (remove trailing slashes and nulls)
  const allowList = rawOrigins
    .filter(Boolean)
    .map(url => url.replace(/\/$/, ""));

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, Server-to-Server)
      if (!origin) return callback(null, true);

      // Clean incoming origin to match our list
      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowList.includes(cleanOrigin)) {
        return callback(null, true);
      } else {
        console.log(`❌ CORS BLOCKED: ${origin}`);
        return callback(new Error(`Not allowed by CORS`));
      }
    },
    credentials: true,
    allowedHeaders: ["content-type", "authorization", "apollo-require-preflight", "x-apollo-operation-name", "apollo-operation-name"],
  };

  // ---------- Middleware Setup ----------

  // 1. Handle Preflight
  app.options("/graphql", cors(corsOptions));

  // 2. Main Entry Point
  app.use(
    "/graphql",
    cors(corsOptions),
    graphqlUploadExpress({ maxFileSize: 20 * 1024 * 1024, maxFiles: 10 }),
    express.json({ limit: "10mb" }),
    expressMiddleware(new ApolloServer({
      typeDefs,
      resolvers: { Upload: GraphQLUpload, ...resolvers },
      introspection: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    }), {
      context: async ({ req, res }) => {
        // Run Auth Check
        const auth = assertAuth(req);
        return { req, res, auth };
      },
    })
  );

  // ---------- Start ----------
  const PORT = process.env.PORT || 4000;

  try {
    console.log("Connecting to database...");
    await db.sequelize.sync();
    console.log("✅ Database connected!");

    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(` Server ready at http://0.0.0.0:${PORT}/graphql`);
    console.log(`  CORS Whitelist:`, allowList);

  } catch (err) {
    console.error(" Startup Error:", err);
    process.exit(1);
  }
}

if (require.main === module) startServer();
module.exports = startServer;