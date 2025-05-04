const User = require('../../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hashPassword -__v -createdAt -updatedAt');
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = getAllUsers;