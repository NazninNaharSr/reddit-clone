import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/signup
export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be at least 6 characters" });
    }

    // Check for an existing user first so we return a clean 409 instead of
    // relying on a raw Mongo duplicate-key error.
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "username or email already in use" });
    }

    const user = new User({ username, email });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user._id);
    return res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Use the same error for "no user" and "wrong password" so we don't
    // leak which emails are registered.
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = signToken(user._id);
    return res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}

// GET /api/auth/me  (protected) — returns the currently authenticated user.
export async function me(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}
