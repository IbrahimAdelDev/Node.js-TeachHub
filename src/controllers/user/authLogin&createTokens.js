const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existUser = await User.findOne({ username });

    if (!existUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, existUser.hashPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    // Generate access token
    const accessToken = jwt.sign(
      { userId: existUser.id,
        username: existUser.username,
        email: existUser.email,
        name: existUser.name,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: false, // Set to true in production
      maxAge: 15 * 60 * 1000,
    });
    
    // Generate refresh token and set it as a cookie
    const refreshToken = jwt.sign(
      { userId: existUser.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Nnoe',
      secure: false, // Set to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { hashPassword: _, ...userWithoutPassword } = existUser.toObject();
    return res
      .status(200)
      .json({ message: 'Login successful', token: accessToken, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = loginUser;