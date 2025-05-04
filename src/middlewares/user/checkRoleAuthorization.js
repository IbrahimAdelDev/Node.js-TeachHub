const User = require('../../models/User');

const checkRoleAuthorization = (allowedRoles = []) => {
  return async (req, res, next) => {
    const userId = req.userId; // Assuming userId is set in the request by a previous middleware
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).select(
      '-hashPassword -__v -createdAt -updatedAt'
    ); // Fetch the user from the database
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied. Insufficient permissions' });
    }

    next();
  };
};

module.exports = checkRoleAuthorization;
