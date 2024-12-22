const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: [true, 'Homepage review content is a required field.'],
    minlength: [1, 'Homepage review content is required to be longer than 1 character.']
  },
  likes: {
    type: Number,
    default: 0
  },
  writtenBy: {
    type: String,
    trim: true,
    required: [true, 'Homepage review written by is a required field.'],
    minlength: [1, 'Homepage review written by is required to be longer than 1 character.'],
    maxlength: [360, 'Homepage review written by must not be longer than 360 characters.']
  },
  byImage: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.file'
  },
  byImagePath: {
    type: String,
    default: 'No Display Stream Path',
    required: true
  },
  byRating: {
    type: Number,
    default: 5,
    max: [5, "Homepage review by rating must not be higher than 5."]
  },
  oAnswered: {
    type: Boolean,
    default: false
  },
  oResponse: {
    type: String,
    default: 'Dragon-Onyx Software Solutions has not yet responded to customer review.',
    minlength: [1, 'Homepage business owner response must be at least 1 character.'],
    trim: true
  },
  oRDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
