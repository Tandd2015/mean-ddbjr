const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewGoogleSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: [true, 'Google review content is a required field.'],
    minlength: [1, 'Google review content is required to be longer than 1 character.']
  },
  likes: {
    type: Number,
    default: 0
  },
  writtenBy: {
    type: String,
    trim: true,
    required: [true, 'Google review written by is a required field.'],
    minlength: [1, 'Google review written by is required to be longer than 1 character.'],
    maxlength: [360, 'Google review written by must not be longer than 360 characters.']
  },
  byImage: {
    type: String,
    required: [true, 'Google review user image is a required field must not be blank.'],
    minlength: [1, 'Google review user image must be at least 1 character.'],
    trim: true
  },
  byContribute: {
    type: String,
    default: 'No prior google reviews',
    minlength: [1, 'Prior google reviews category must be at least 1 character.'],
    maxlength: [360, 'Prior google reviews category must not be longer than 360 characters.'],
    trim: true
  },
  byContributeLink: {
    type: String,
    required: [true, 'Google review user reviews link is a required field must not be blank.'],
    minlength: [1, 'Google review user reviews link must be at least 1 character.'],
    trim: true
  },
  byRating: {
    type: Number,
    default: 5
  },
  byDate: {
    type: String,
    required: [true, 'Google review user created date is a required field must not be blank.'],
    minlength: [1, 'Google review user created date must be at least 1 character.'],
    maxlength: [360, 'Google review user created date must not be longer than 360 characters.'],
    trim: true
  },
  oResponse: {
    type: String,
    default: 'Dragon-Onyx Software Solutions has not yet responded to customer review.',
    minlength: [1, 'Google business owner response must be at least 1 character.'],
    trim: true
  },
  oRDate: {
    type: String,
    default: 'Dragon-Onyx Software Solutions has not yet responded to customer review.',
    minlength: [1, 'Google business owner response date must be at least 1 character.'],
    maxlength: [360, 'Google business owner response date must not be longer than 360 characters.'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReviewGoogle', ReviewGoogleSchema);
