const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: [true, 'Post Content is a required field.'],
    minlength: [1, 'Post Content is required to be longer than 1 character.']
  },
  writtenBy: {
    type: String,
    default: '419 Paint & Body.'
  },
  category: {
    type: String,
    required: [true, 'Post category is a required field must not be blank.'],
    minlength: [1, 'Post category must be at least 1 character.'],
    maxlength: [360, 'Post category must not be longer than 360 characters.'],
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  mainImage: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.file',
    required: true
  },
  mainImagePath: {
    type: String,
    required: true
  },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'uploads.file'
  }],
  imagesPaths: [{
    type: String
  }],
  videos: [{
    type: Schema.Types.ObjectId,
    ref: 'uploads.file'
  }],
  videosPaths: [{
    type: String,
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
