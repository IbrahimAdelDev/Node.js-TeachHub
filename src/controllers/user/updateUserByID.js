const User = require('../../models/User');

const updateUserByID = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.body.trueQuestions = Number(req.body.trueQuestions || user.trueQuestions);
    req.body.falseQuestions = Number(req.body.falseQuestions || user.falseQuestions);
    req.body.questions = req.body.trueQuestions + req.body.falseQuestions;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-hashPassword -__v -createdAt -updatedAt -role -_id');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user: updatedUser, message: 'User updated successfully' });
  }catch(err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = updateUserByID;