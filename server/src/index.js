require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:3000").split(","),
    credentials: true
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/templates", require("./routes/templates"));
app.use("/api/upload", require("./routes/upload"));

// production: client/dist ko isi server se serve karo
if (process.env.NODE_ENV === "production") {
  const dist = path.join(__dirname, "..", "..", "client", "dist");
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log("Server chal raha hai: http://localhost:" + PORT)))
  .catch((err) => {
    console.error("DB connect nahi hua:", err.message);
    process.exit(1);
  });
