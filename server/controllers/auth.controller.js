const { Http } = require('@status/codes');
const Admin = require('mongoose').model('Admin');

const mongoose = require('mongoose');

const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://127.0.0.1:27017/m-d';

const Grid = require('gridfs-stream');
let gfs;
let gfsT;
const process = require('process');

const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed for uploads! ';
    return cb(new Error('Only image files are allowed for uploads! ', false));
  }
  cb(null, true);
};

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

let connect = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once('connected', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

connect.once('open', () => {
  gfsT = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: 'uploads'});
});

module.exports = {
  login(request, response) {
    let email = request.body.email;
    let password = request.body.password;
    console.log('Logging in admin. ', email, password);
    Admin.findOne({ email })
      .then(admin => {
        return Admin.validatePassword(password, admin.password)
          .then(isValid => {
            if (!isValid) {
              throw new Error();
            }
            completeLogin(request, response, admin);
          });
      })
      .catch(() => {
        response.status(Http.Unauthorized).json('Email address and password combination does not exist within the database. ');
      });
  },
  register(request, response) {
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('profilePicture');
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.file) {
        return response.send('Please select a picture of allowed format. ');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }
      let newId = new mongoose.Types.ObjectId();
      let pathFile = `http://127.0.0.1:5000/api/home/admin/image/${newId}`;
      Admin.create({
        _id: newId,
        email: request.body.email,
        password: request.body.password,
        firstName: request.body.firstName,
        middleName: request.body.middleName,
        lastName: request.body.lastName,
        suffixName: request.body.suffixName,
        phoneNumber: request.body.phoneNumber,
        profilePicture: request.file.id,
        profilePicturePath: pathFile
        // profilePicture: request.files['profilePicture'][0].id
      })
      .then(admin => {
        // const adminObject = admin.toObject();
        completeLogin(request, response, admin);
      })
      .catch(error => response.status(Http.UnprocessableEntity).json(error));
    });
  },
  logout(request, response) {
    request.session.destroy();
    response.clearCookie('adminID');
    response.clearCookie('expiration');
    response.json(true);
  },
};

function completeLogin(request, response, admin) {
  const adminObject = admin.toObject();
  delete admin.password;
  request.session.admin = adminObject;
  response.cookie('adminID', adminObject._id);
  response.cookie('expiration', Date.now() + 86400 * 1000);
  response.json(adminObject);
}
