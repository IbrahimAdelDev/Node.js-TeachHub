const validateUser = (req, res, next) => {
  const { username, email, name, password } = req.body;

  if (!username || !email || !name || !password) {
    return res.status(400).json({ error: `missing required fields` });
  }

  if (username.length > 32 || email.length > 32 || name.length > 32) {
    return res
      .status(400)
      .json({ error: `username, email or name is too long` });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: `weak password` });
  }

  if (password.length > 128) {
    return res
      .status(400)
      .json({ error: `password is too long` });
  }

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/;

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      error: `password must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
    });
  }

  next();
};

module.exports = validateUser;
