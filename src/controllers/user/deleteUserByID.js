const User = require('../../models/User');

const deleteUserByID = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = deleteUserByID;