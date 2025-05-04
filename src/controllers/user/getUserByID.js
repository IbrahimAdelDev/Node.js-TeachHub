const User = require('../../models/User');

const getUserByID = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-hashPassword -__v -createdAt -updatedAt -role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = getUserByID;