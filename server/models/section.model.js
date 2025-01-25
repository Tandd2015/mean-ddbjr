const mongoose = require('mongoose');
const { Schema } = mongoose;

const SectionSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: [1, 'Section title is required to be longer than 1 character.'],
    required: [true, 'Section title is a required field.']
  },
  content: {
    type: String,
    trim: true,
    minlength: [1, 'Section content is required to be longer than 1 character.'],
    required: [true, 'Section content is a required field.']
  },
  sectionImage: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.file',
    required: [true, 'Section image is a required field.']
  },
  sectionImagePath: {
    type: String,
    trim: true,
    required: [true, 'Section image path is a required field must not be blank.'],
    minlength: [1, 'Section image path must be at least 1 character.'],
  },
  sectionImageAttributionCredit: {
    type: String,
    trim: true,
    minlength: [1, 'Section image attribution credit is required to be longer than 1 character.'],
    required: [true, 'Section image attribution credit is a required field.']
  },
  sectionImageAttributionLink: {
    type: String,
    trim: true,
    minlength: [1, 'Section image attribution link is required to be longer than 1 character.'],
    required: [true, 'Section image attribution link is a required field.']
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Section', SectionSchema);
