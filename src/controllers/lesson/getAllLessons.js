const Lesson = require('../../models/Lesson');

const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({}).select('-__v -createdAt -updatedAt');
    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ error: 'No lessons found' });
    }
    res.status(200).json({ message: 'Lessons fetched successfully', lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching lessons' });
  }
};

module.exports = getAllLessons;