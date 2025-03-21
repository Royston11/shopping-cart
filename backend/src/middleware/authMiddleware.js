const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // Extract token

  console.log("Received Token:", token); 

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    if (!req.user) return res.status(401).json({ error: "Unauthorized - User not found" });

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateUser;
