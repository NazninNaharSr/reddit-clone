import jwt from "jsonwebtoken";

// Middleware that protects routes. It reads a Bearer token from the
// Authorization header, verifies it, and attaches the decoded user id to
// req.userId so downstream handlers know who is making the request.
//
// We use stateless JWTs (rather than server-side sessions) so any node in
// the cluster can validate a request without a shared session store. That
// matters for the distributed version — it's why the API scales horizontally.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
