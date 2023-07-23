const jwt = require("jsonwebtoken");
const Session = require("../model/session");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const { username, email, session, id } = decodeToken;
    req.user = { username, email, id };
    const sessionId = session.sessionId;
    const currentSession = await Session.findOne({
      sessionId,
      expiresAt: { $gte: new Date() },
    });
    if (!currentSession) {
      return res.status(401).json({ message: "Invalid or Expired Session" });
    }
    // Calculate the remaining time before token expiration
    const tokenExpirationTime = new Date(decodeToken.exp * 1000).getTime();
    const currentTime = new Date().getTime();
    const remainingTime = tokenExpirationTime - currentTime;

    // If the remaining time is less than 1 minute (60000 milliseconds), return a custom response
    if (remainingTime < 60000) {
      return res.status(401).json({ message: "Token about to expire" });
    }
    req.session = currentSession;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAuthenticated;
