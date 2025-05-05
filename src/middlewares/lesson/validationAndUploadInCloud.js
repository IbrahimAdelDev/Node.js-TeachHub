const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const Lesson = require('../../models/Lesson');

const isString = (value) => typeof value === 'string';
const sanitize = (str) => str.replace(/[<>"'`;$]/g, '').trim();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mov'];

    if (file.fieldname === 'images') {
      if (!validImageTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid image format. Only JPEG, JPG, PNG, and GIF are allowed.'));
      }
    } else if (file.fieldname === 'videos') {
      if (!validVideoTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid video format. Only MP4, WebM, Mov, and OGG are allowed.'));
      }
    }

    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // Maximum file size 50MB
  },
});

const uploadLessonMiddleware = async (req, res, next) => {
  upload.fields([
    { name: 'videos', maxCount: 10 },
    { name: 'images', maxCount: 10 },
  ])(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size is too large. Maximum allowed size is 50MB.' });
      }
      return res.status(400).json({ error: err.message });
    }

    let { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    if (![title, description].every(isString)) {
      return res.status(400).json({ error: 'Title and description must be strings.' });
    }

    title = sanitize(title);
    description = sanitize(description);

    if (title.length > 100) {
      return res.status(400).json({ error: 'Title should not exceed 100 characters.' });
    }

    if (description.length > 500) {
      return res.status(400).json({ error: 'Description should not exceed 500 characters.' });
    }

    const uploadToCloudinary = (fileBuffer, folder, resource_type = 'image') => {
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

    try {

      const existingLesson = await Lesson.findOne({ title });
      if (existingLesson) {
        return res.status(400).json({ error: 'Lesson with this title already exists.' });
      }
      
      const videoFiles = req.files.videos || [];
      const imageFiles = req.files.images || [];

      // Upload videos to Cloudinary
      req.body.videoUrls = await Promise.all(
        videoFiles.map((file) => uploadToCloudinary(file.buffer, `lessons/${title}`, 'video'))
      );

      // Upload images to Cloudinary
      req.body.imageUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file.buffer, `lessons/${title}`, 'image'))
      );

      // Generate HLS URLs from video URLs (--Test--)
      req.body.hlsUrls = req.body.videoUrls.map((url) => ({ url: url.replace(/\.mp4$/, '.m3u8') }));
      req.body.title = title;
      req.body.description = description; 
      next();
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Error uploading files' });
    }
  });
};

module.exports = uploadLessonMiddleware;

