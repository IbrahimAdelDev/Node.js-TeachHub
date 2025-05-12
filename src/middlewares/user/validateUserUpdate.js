const User = require('../../models/User');

const isString = (value) => typeof value === 'string';
const isNumber = (value) => typeof value === 'number';
const sanitize = (str) => {
  if (typeof str !== 'string') return ''; 
  return str.replace(/[<>"'`;$]/g, '').trim();
};

const cleanUpdateData = (allowedFields = []) => {
  return async (req, res, next) => {
    const data = req.body;
    const cleanedData = {};

    allowedFields.forEach((field) => {
      if (
        data.hasOwnProperty(field) &&
        data[field] !== '' &&
        data[field] !== null &&
        data[field] !== undefined
      ) {
        cleanedData[field] = data[field];
      }
    });
    req.body = cleanedData;
    let { username, email, name, exams, trueQuestions, falseQuestions } =
      req.body;

    if (![username, email, name].every(isString)) {
      return res.status(400).json({ error: `Some must be strings` });
    }

    if (![exams, trueQuestions, falseQuestions].every(isNumber)) {
      return res.status(400).json({ error: `Some must be numbers` });
    }

    username = sanitize(username);
    email = sanitize(email.toLowerCase());
    name = sanitize(name);
    exams = sanitize(exams);
    trueQuestions = sanitize(trueQuestions);
    falseQuestions = sanitize(falseQuestions);

    exams = Number(exams);
    trueQuestions = Number(trueQuestions);
    falseQuestions = Number(falseQuestions);

    if (
      (username && username.length > 32) ||
      (email && email.length > 32) ||
      (name && name.length > 32)
    ) {
      return res
        .status(400)
        .json({ error: `username, email or name is too long` });
    }

    const userId = req.params.id;
    try {
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.body.username = username;
      req.body.email = email;
      req.body.name = name;
      req.body.exams = exams;
      req.body.trueQuestions = trueQuestions
        ? trueQuestions
        : existingUser.trueQuestions;
      req.body.falseQuestions = falseQuestions
        ? falseQuestions
        : existingUser.falseQuestions;
      req.body.questions = req.body.trueQuestions + req.body.falseQuestions;
      next();
    } catch (err) {
      console.error('Validation error:', err);
      return res.status(500).json({ error: 'Server validation error' });
    }
  };
};

module.exports = cleanUpdateData;
