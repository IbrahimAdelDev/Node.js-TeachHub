const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existUser = await User.findOne({ username });

    if (!existUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the password is correct
    await bcrypt.compare(password, existUser.hashPassword, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      return result;
    });

    // Generate access token
    const accessToken = await jwt.sign(
      { userId: existUser.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    // Generate refresh token and set it as a cookie
    const refreshToken = await jwt.sign(
      { userId: existUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRES }
    );
    console.log(refreshToken); // Log the refresh token for debugging
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: false, // Set to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { hashPassword: _, ...userWithoutPassword } = existUser.toObject();
    return res
      .status(200)
      .json({ accessToken, user: userWithoutPassword })
      .message('Login successful');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
