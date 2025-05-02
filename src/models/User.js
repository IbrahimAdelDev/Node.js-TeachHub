const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 32,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    hashPassword: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
      maxlength: 16,
    },
    exams: {
        type: Number,
        default: 0,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Exam',
      },
    questions: {
        type: Number,
        default: 0,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Question',
      },
    trueQuestions: {
        type: Number,
        default: 0,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Question',
      },
    falseQuestions: {
        type: Number,
        default: 0,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Question',
      },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
