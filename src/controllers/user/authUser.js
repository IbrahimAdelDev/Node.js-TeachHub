const User = require('../../models/User');

const authUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-hashPassword -__v -createdAt -updatedAt -role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json({ token ,user , message: 'User authenticated successfully' });
  }
  catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authUser;