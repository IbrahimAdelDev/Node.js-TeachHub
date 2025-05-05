const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrls: [
      {
        url: { type: String, trim: true },
      },
    ],
    imageUrls: [
      {
        url: { type: String, trim: true },
      },
    ],
    hlsUrls: [
      {
        url: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
