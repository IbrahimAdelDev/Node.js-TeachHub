const isString = (value) => typeof value === 'string';
const sanitize = (str) => str.replace(/[<>"'`;$]/g, '').trim();

const validateLogin = (req, res, next) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: `missing required fields` });
  }

  if (![username, password].every(isString)) {
    return res.status(400).json({ error: `All fields must be strings` });
  }

  username = sanitize(username);

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

  req.body.username = username;
  next();
};

module.exports = validateLogin;
