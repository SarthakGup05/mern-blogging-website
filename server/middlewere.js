import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied, token missing or malformed!" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify using the secret
    req.user = decoded; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error); // Log error for debugging
    return res.status(401).json({ message: "Invalid token!" });
  }
};

export { verifyToken };
