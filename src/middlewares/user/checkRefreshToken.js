const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.userId = decoded.userId;
    console.log("Refresh Token Work ✅✅😊👌");
    return next();
  });
};

module.exports = verifyRefreshToken;