const Lesson = require('../../models/Lesson');
const cloudinary = require('../../config/cloudinary');
const getPublicId = require('./cloudHandle/getPublicId');
const deleteFromCloudinary = require('./cloudHandle/deleteFiles');

const updateLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, removeVideoUrls = [], removeImageUrls = []} = req.body;

    const lesson = await Lesson.findById(id);

    const imagePublicIdsToDelete = removeImageUrls.map((img) => getPublicId(img.url, lesson));
    const videoPublicIdsToDelete = removeVideoUrls.map((vid) => getPublicId(vid.url, lesson));

    if (imagePublicIdsToDelete.length) await deleteFromCloudinary(imagePublicIdsToDelete, 'image');
    if (videoPublicIdsToDelete.length) await deleteFromCloudinary(videoPublicIdsToDelete, 'video');
    
    const removeImageUrlStrings = removeImageUrls.map(obj => obj.url);
    const removeVideoUrlStrings = removeVideoUrls.map(obj => obj.url);

    const remainingImages = lesson.imageUrls.filter(
      (img) => !removeImageUrlStrings.includes(img.url)
    );

    const remainingVideos = lesson.videoUrls.filter(
      (vid) => !removeVideoUrlStrings.includes(vid.url)
    );

    // Merge old + new videos/images if any new ones uploaded
    const updatedVideos = [
      ...remainingVideos,
      ...(req.body.newVideoUrls || []).map((url) => ({ url })),
    ];
    const updatedImages = [
      ...remainingImages,
      ...(req.body.newImageUrls || []).map((url) => ({ url })),
    ];

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      {
        title: title || lesson.title,
        description: description || lesson.description,
        videoUrls: updatedVideos,
        imageUrls: updatedImages,
        hlsUrls: updatedVideos.map((v) => ({
          url: v.url.replace(/\.mp4$/, '.m3u8'),
        })),
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating lesson' });
  }
};

module.exports = updateLessonById;

