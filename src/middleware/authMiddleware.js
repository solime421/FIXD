import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header (expects format "Bearer <token>")
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
  // Guard clause
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  
  try {
    // Verify the token using the secret; if valid, decoded will contain the payload (e.g., { id, role })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user info to the request object for later use in route handlers
    req.user = decoded;  // Now you can use req.user.id and req.user.role in your endpoints
    
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};