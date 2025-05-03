const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;

const regenerateAccessToken = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'Unauthorized' });
  }

  const newAccessToken = jwt.sign(
    { userId: req.userId },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    sameSite: 'Strict',
    secure: false, 
    maxAge: 15 * 60 * 1000,
  });
  console.log('New access token generated:', newAccessToken);

  return res.status(200).json({ message: 'Access token regenerated', token: newAccessToken });
}

module.exports = regenerateAccessToken;