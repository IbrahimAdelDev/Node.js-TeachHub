const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const Lesson = require('../../models/Lesson');
const toArray = require('./validationHandel/toArray');

const isString = (value) => typeof value === 'string';
const sanitize = (str) => str.replace(/[<>"'`;$]/g, '').trim();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
    ];
    const validVideoTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/mov',
    ];

    if (file.fieldname === 'images') {
      if (!validImageTypes.includes(file.mimetype)) {
        return cb(
          new Error(
            'Invalid image format. Only JPEG, JPG, PNG, and GIF are allowed.'
          )
        );
      }
    } else if (file.fieldname === 'videos') {
      if (!validVideoTypes.includes(file.mimetype)) {
        return cb(
          new Error(
            'Invalid video format. Only MP4, WebM, Mov, and OGG are allowed.'
          )
        );
      }
    }

    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // Maximum file size 50MB
});

const uploadLessonUpdateMiddleware = async (req, res, next) => {
  upload.fields([
    { name: 'videos', maxCount: 10 },
    { name: 'images', maxCount: 10 },
  ])(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({
            error: 'File size is too large. Maximum allowed size is 50MB.',
          });
      }
      return res.status(400).json({ error: err.message });
    }

    let { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: 'Title and description are required.' });
    }

    if (![title, description].every(isString)) {
      return res
        .status(400)
        .json({ error: 'Title and description must be strings.' });
    }

    title = sanitize(title);
    description = sanitize(description);

    if (title.length > 100) {
      return res
        .status(400)
        .json({ error: 'Title should not exceed 100 characters.' });
    }

    if (description.length > 500) {
      return res
        .status(400)
        .json({ error: 'Description should not exceed 500 characters.' });
    }

    try {
      const { id } = req.params;
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found.' });
      }

      title = lesson.title; // Use existing title for consistency

      const uploadToCloudinary = (
        fileBuffer,
        folder,
        resource_type = 'image'
      ) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const videoFiles = req.files.videos || [];
      const imageFiles = req.files.images || [];

      // Upload new videos and images if present
      req.body.newVideoUrls = await Promise.all(
        videoFiles.map((file) =>
          uploadToCloudinary(file.buffer, `lessons/${title}`, 'video')
        )
      );

      req.body.newImageUrls = await Promise.all(
        imageFiles.map((file) =>
          uploadToCloudinary(file.buffer, `lessons/${title}`, 'image')
        )
      );

      // Generate HLS URLs for new videos (--Test--)
      req.body.hlsUrls = req.body.newVideoUrls.map((url) => {
        const videoName = url.split('/').pop().split('.')[0];
        return `https://res.cloudinary.com/${
          process.env.CLOUDINARY_CLOUD_NAME
        }/video/upload/v${Date.now()}/lessons/${title}/${videoName}.m3u8`;
      });

      req.body.title = title;
      req.body.description = description;

      req.body.removeVideoUrls = toArray(req.body.removeVideoUrls).map((url) => ({ url }));
      req.body.removeImageUrls = toArray(req.body.removeImageUrls).map((url) => ({ url }));

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error handling update files.' });
    }
  });
};

module.exports = uploadLessonUpdateMiddleware;
