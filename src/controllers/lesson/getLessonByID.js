const Lesson = require('../../models/Lesson');

const getLessonByID = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findById(id).select('-__v -createdAt -updatedAt');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getLessonByID;