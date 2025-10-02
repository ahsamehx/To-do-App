import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Bearer <token>
  
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // get the token part

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to request (from token payload)
    req.userId = decoded.id;

    next(); // continue to the actual route
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
