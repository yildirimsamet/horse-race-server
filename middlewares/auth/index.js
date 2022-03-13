require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      }
      res.locals.userId = decoded.id;
      next();
    });
  } else {
    return res.json({
      success: false,
      message: "No token provided",
    });
  }
};
