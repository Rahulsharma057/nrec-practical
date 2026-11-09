
require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------

const allowedOrigins = [
  // Stable production domain
  "https://nrec-practical.vercel.app",

  // Main branch deployment
  "https://nrec-practical-git-main-rahulsharma3-9031s-projects.vercel.app",

  // Local development
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",

  // CLIENT_URL env var — comma-separated extra origins (e.g. a renamed/custom domain)
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];

// Automatically allow future Vercel preview deployments
const vercelPreviewPattern =
  /^https:\/\/nrec-practical-(?:git-[a-z0-9-]+|[a-z0-9]+)-rahulsharma3-9031s-projects\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin (Postman/server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      vercelPreviewPattern.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }

    console.log("Blocked CORS Origin:", origin);

    return callback(new Error("CORS: Origin not allowed"));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

// CORS middleware must be before routes
app.use(cors(corsOptions));

// --------------------------------------------------
// BODY PARSER
// --------------------------------------------------

app.use(express.json({ limit: "2mb" }));

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV,
    message: "NREC API is running",
  });
});

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/auth", require("./routes/auth"));
app.use("/api/templates", require("./routes/templates"));
app.use("/api/upload", require("./routes/upload"));

// --------------------------------------------------
// PRODUCTION FRONTEND
// --------------------------------------------------

if (process.env.NODE_ENV === "production") {
  const dist = path.join(
    __dirname,
    "..",
    "..",
    "client",
    "dist"
  );

  app.use(express.static(dist));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(dist, "index.html"));
  });
}

// --------------------------------------------------
// ERROR HANDLING
// --------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// --------------------------------------------------
// SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`NREC Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
