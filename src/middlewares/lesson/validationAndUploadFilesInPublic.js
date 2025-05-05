const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ storage: multer.memoryStorage() });

const uploadMiddleware = async (req, res, next) => {

  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const title = req.body.title;
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const uploadDir = path.join(__dirname, `../../../public/uploads/${title}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const saveFile = (file) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);
        return `uploads/${title}/${filename}`; 
      };

      if (req.files.video && req.files.video[0]) {
        req.body.videoPath = saveFile(req.files.video[0]);
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        req.body.thumbnailPath = saveFile(req.files.thumbnail[0]);
      }

      next(); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'File processing error' });
    }
  });
};

module.exports = uploadMiddleware;
