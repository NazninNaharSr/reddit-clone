import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Health check — the load balancer and your load-testing harness will hit
// this to confirm a node is alive. Keep it cheap (no DB call).
app.get("/health", (req, res) => {
  res.json({ status: "ok", node: process.env.NODE_ID || "single" });
});

// Feature routes
app.use("/api/auth", authRoutes);

// Fallback 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
