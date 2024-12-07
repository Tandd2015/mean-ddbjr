const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const AdminSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Admin email address input is must be unique. '],
    required: [true, 'Admin email address input is a required field must not be blank. '],
    minlength: [1, 'Admin email address input must be at least 1 character. '],
    maxlength: [333, 'Admin email address input must not be longer than 333 characters. '],
    trim: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      msg: 'Admin email address input {VALUE} is not of a valid email address format. '
    }
  },
  password: {
    type: String,
    required: [true, 'Admin password is a required field. ']
  },
  firstName: {
    type: String,
    required: [true, 'Admin first name input is a required field must not be blank. '],
    minlength: [1, 'Admin first name input is required to be longer than 1 character. '],
    maxlength: [123, 'Admin first name input is required to be shorter than 124 characters. '],
    trim: true
  },
  middleName: {
    type: String,
    required: [true, 'Admin middle name input is a required field must not be blank. '],
    minlength: [1, 'Admin middle name input is required to be longer than 1 character. '],
    maxlength: [123, 'Admin middle name input is required to be shorter than 124 characters. '],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Admin last name input is a required field must not be blank. '],
    minlength: [1, 'Admin last name input is required to be longer than 1 character. '],
    maxlength: [123, 'Admin last name input is required to be shorter than 124 characters. '],
    trim: true
  },
  suffixName: {
    type: String,
    required: [true, 'Admin suffix name input is a required field must not be blank. '],
    minlength: [1, 'Admin suffix name input is required to be longer than 1 character. '],
    maxlength: [123, 'Admin suffix name input is required to be shorter than 124 characters. '],
    default: 'None',
    trim: true
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Admin phone number input is a required field must not be blank. '],
    minlength: [10, 'Admin phone number input is required to be longer than 9 characters. '],
    maxlength: [11, 'Admin phone number input is required to be shorter than 11 characters. '],
    trim: true
  },
  profilePicture: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.file'
  },
  profilePicturePath: {
    type: String,
    default: 'No Display Stream Path',
    required: true
  },
}, {
  timestamps: true
});

AdminSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });
AdminSchema.pre('validate', function(next) {
  if(!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(next);
});

AdminSchema.static('validatePassword', function(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
});

module.exports = mongoose.model('Admin', AdminSchema);
