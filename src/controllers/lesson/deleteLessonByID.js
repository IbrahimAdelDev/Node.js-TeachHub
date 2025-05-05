const Lesson = require('../../models/Lesson');
const cloudinary = require('../../config/cloudinary');
const deleteFromCloudinary = require('./cloudHandle/deleteFiles');

const deleteLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const imagepublicIds = [];
    const videoPublicIds = [];

    lesson.videoUrls.forEach((video) => {
      videoPublicIds.push(
        `lessons/${lesson.title}/${video.url.split('/').pop().split('.')[0]}`
      );
    });

    lesson.imageUrls.forEach((image) => {
      imagepublicIds.push(
        `lessons/${lesson.title}/${image.url.split('/').pop().split('.')[0]}`
      );
    });

    console.log(imagepublicIds);
    const cloudinaryResponse = await deleteFromCloudinary(
      imagepublicIds,
      'image'
    );
    console.log(videoPublicIds);
    const cloudinaryResponsevideos = await deleteFromCloudinary(
      videoPublicIds,
      'video'
    );

    const deletedLesson = await Lesson.findByIdAndDelete(id);
    if (!deletedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    return res.status(200).json({
      message: 'Lesson deleted successfully',
      cloudinaryResponse,
      cloudinaryResponsevideos,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Error deleting the lesson',
    });
  }
};

module.exports = deleteLessonById;
