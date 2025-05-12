const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const dotenv = require('dotenv');
dotenv.config();

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Unauthorized' });
    }

    req.userId = decoded.userId;
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 60 * 1000,
    });

    return next();
  });
};

module.exports = verifyRefreshToken;