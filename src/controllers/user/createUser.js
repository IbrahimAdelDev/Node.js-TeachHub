const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const createUser = async (req, res) => {
  try {
    console.log('Received body:', req.body);

    const { username, email, name, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      name,
      hashPassword,
      role,
    });

    const { hashPassword: _, ...userWithoutPassword } = newUser.toObject();
    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Error in createUser:', err.message);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};
module.exports = createUser;
