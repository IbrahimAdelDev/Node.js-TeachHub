const authLogout = async (req, res) => {
  try {
    // Clear the cookies for access and refresh tokens
    res.clearCookie('accessToken', { httpOnly: true, secure: true });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });

    // Send a success response
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = authLogout;