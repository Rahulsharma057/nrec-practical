const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Pehle login karo" });
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User nahi mila" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expire ho gaya, dobara login karo" });
  }
}

module.exports = { protect };
