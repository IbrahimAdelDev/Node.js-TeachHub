const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: `missing required fields` });
  }

  if (username.length > 32) {
    return res
      .status(400)
      .json({ error: `Invalid credentials` });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: `Invalid credentials` });
  }

  if (password.length > 128) {
    return res
      .status(400)
      .json({ error: `Invalid credentials` });
  }

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/;

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      error: `Invalid credentials`,
    });
  }

  next();
};

module.exports = validateLogin;
