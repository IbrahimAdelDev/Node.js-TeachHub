const User = require('../../models/User');

const isString = (value) => typeof value === 'string';
const sanitize = (str) => str.replace(/[<>"'`;$]/g, '').trim();

const validateUser = async (req, res, next) => {
  let { username, email, name, password } = req.body;


  if (!username || !email || !name || !password) {
    return res.status(400).json({ error: `missing required fields` });
  }

  if (![username, email, name, password].every(isString)) {
    return res.status(400).json({ error: `All fields must be strings` });
  }

  username = sanitize(username);
  email = sanitize(email.toLowerCase());
  name = sanitize(name);

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

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ error: `User already exists` });
    }

    req.body.username = username;
    req.body.email = email;
    req.body.name = name;
    req.body.role = 'user'; // Default role
    next();
  } catch (err) {
    console.error('Validation error:', err);
    return res.status(500).json({ error: 'Server validation error' });
  }
};

module.exports = validateUser;
