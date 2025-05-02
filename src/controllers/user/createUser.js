const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { username, email, name, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ error: `User is exist` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      username,
      email,
      name,
      hashPassword,
      role,
    });

    // Remove password before sending response
    const { hashPassword: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = createUser;
