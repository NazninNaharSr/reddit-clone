import mongoose from "mongoose";

// Connects to MongoDB. We set a connection pool size explicitly because
// pool exhaustion is the #1 cause of dropped requests under load — this is
// the knob you'll tune later during load testing.
export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 20, // max simultaneous connections held open to Mongo
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // fail fast if we can't reach the DB on startup
  }
}
