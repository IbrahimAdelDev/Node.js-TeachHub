const cleanUpdateData = (allowedFields = []) => {
  return (req, res, next) => {
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
    const { username, email, name, exams, trueQuestions, falseQuestions } = req.body;

    if (
      (username && username.length > 32) ||
      (email && email.length > 32) ||
      (name && name.length > 32)
    ) {
      return res
        .status(400)
        .json({ error: `username, email or name is too long` });
    }
    
    next();
  };
};

module.exports = cleanUpdateData;
