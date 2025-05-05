const Lesson = require('../../models/Lesson');

async function createLesson(req, res) {
  try {
    const { title, description, videoUrls, imageUrls, hlsUrls } = req.body;
    const lessonData = {
      title,
      description,
      videoUrls: videoUrls.map((url) => ({ url })),
      imageUrls: imageUrls.map((url) => ({ url })),
      hlsUrls,
    };

    const lesson = await Lesson.create(lessonData);
    if (!lesson) {
      return res.status(400).json({ error: 'Error creating lesson' });
    }
    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating lesson' });
  }
}

module.exports = createLesson;
