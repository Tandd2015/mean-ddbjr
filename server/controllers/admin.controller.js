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
  index(request, response) {
    Admin.find({})
      .then(adminsInfo => {
        if (!adminsInfo || adminsInfo.length === 0) {
          return response.status(404).json(`No Administrator's was found... ${adminsInfo}`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
          })
          .then(newFiles => {
            let adminsComplete = adminsInfo.map(adminInfo => {
              let profilePicture = newFiles.find(adminFile => adminInfo.profilePicture?.toString() === adminFile._id.toString());
              return {
                _id: adminInfo._id,
                email: adminInfo.email,
                password: adminInfo.password,
                firstName: adminInfo.firstName,
                middleName: adminInfo.middleName,
                lastName: adminInfo.lastName,
                suffixName: adminInfo.suffixName,
                phoneNumber: adminInfo.phoneNumber,
                profilePicture: profilePicture,
                profilePicturePath: adminInfo.profilePicturePath,
                createdAt: adminInfo.createdAt,
                updatedAt: adminInfo.updatedAt,
              };
            });
            response.json(adminsComplete);
          })
          .catch(error => response.status(Http.InternalServerError).json(error));
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  show(request, response) {
    const { admin_id: adminId } = request.params;
    Admin.findOne({_id: adminId})
      .then(adminInfo => {
        if (!adminInfo) {
          return response.status(404).json(`No Administrator was found... ${adminInfo}`);
        }
        gfs.files.find({_id: adminInfo.profilePicture})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
          })
          .then(newFiles => {
            let adminComplete = {
              _id: adminInfo._id,
              email: adminInfo.email,
              password: adminInfo.password,
              firstName: adminInfo.firstName,
              middleName: adminInfo.middleName,
              lastName: adminInfo.lastName,
              suffixName: adminInfo.suffixName,
              phoneNumber: adminInfo.phoneNumber,
              profilePicture: newFiles[0],
              profilePicturePath: adminInfo.profilePicturePath,
              createdAt: adminInfo.createdAt,
              updatedAt: adminInfo.updatedAt,
            };
            response.json(adminComplete);
          })
          .catch(error => response.status(Http.NotFound).json(error));
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  showImage(request, response) {
    const { admin_id: adminId } = request.params;
    Admin.findOne({_id: adminId})
      .then(adminInfo => {
        if (!adminInfo) {
          return response.status(404).json(`No Administrator was found... ${adminInfo}`);
        }
        return gfsT.openDownloadStream(adminInfo.profilePicture).pipe(response);
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  update(request, response) {
    const { admin_id: adminId } = request.params;
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('profilePicture');
      upload(request, response, (error) => {
        if (request.fileValidationError) {
          return response.send(request.fileValidationError);
        } else if (error instanceof multer.MulterError) {
          return response.send(error);
        } else if (error) {
          return response.send(error);
        } else if (!request.file) {
          Admin.findByIdAndUpdate(adminId, request.body, { new: true, runValidators: true })
            .then(adminInfo => {
              if (!adminInfo) {
                return response.status(404).json(`Admin with the id: ${adminId} was not found...`);
              }
              gfs.files.find({_id: adminInfo.profilePicture})
                .toArray((err, files) => {
                  if (!files) {
                    return response.status(404).json(err);
                  };
                })
                .then(newFiles => {
                  const adminComplete = {
                    _id: adminInfo._id,
                    email: adminInfo.email,
                    password: adminInfo.password,
                    firstName: adminInfo.firstName,
                    middleName: adminInfo.middleName,
                    lastName: adminInfo.lastName,
                    suffixName: adminInfo.suffixName,
                    phoneNumber: adminInfo.phoneNumber,
                    profilePicture: newFiles[0],
                    profilePicturePath: adminInfo.profilePicturePath,
                    createdAt: adminInfo.createdAt,
                    updatedAt: adminInfo.updatedAt,
                  };
                  response.json(adminComplete);
                })
                .catch(error => response.status(Http.UnprocessableEntity).json(error));
              })
              .catch(error => response.status(Http.UnprocessableEntity).json(error));
        } else {
          let oldProfilePicture;
          Admin.findOne({_id: adminId})
            .then(adminInfo => {
              if (!adminInfo) {
                return response.status(404).json(`No Administrator was found... ${adminInfo}`);
              };
              oldProfilePicture = adminInfo.profilePicture;
            })
            .catch(error => response.status(Http.NotFound).json(error));
          let pathFile = `http://127.0.0.1:5000/api/home/admin/image/${adminId}`;
          let newRequest = {...request.body, profilePicture: request.file.id, profilePicturePath: pathFile };
          Admin.findByIdAndUpdate(adminId, newRequest, { new: true, runValidators: true })
            .then(adminInfo => {
              if (!adminInfo) {
                return response.status(404).json(`Admin with the id: ${adminId} was not found...`);
              };
              gfs.files.find({_id: adminInfo.profilePicture})
                .toArray((err, files) => {
                  if (!files) {
                    return response.status(404).json(err);
                  };
                })
                .then(newFiles => {
                  const adminComplete = {
                    _id: adminInfo._id,
                    email: adminInfo.email,
                    password: adminInfo.password,
                    firstName: adminInfo.firstName,
                    middleName: adminInfo.middleName,
                    lastName: adminInfo.lastName,
                    suffixName: adminInfo.suffixName,
                    phoneNumber: adminInfo.phoneNumber,
                    profilePicture: newFiles[0],
                    profilePicturePath: adminInfo.profilePicturePath,
                    createdAt: adminInfo.createdAt,
                    updatedAt: adminInfo.updatedAt,
                  };
                  gfsT.delete(oldProfilePicture, (err, file) => {
                    if (err) {
                      return response.status(Http.Conflict.json(err));
                    };
                  })
                  .catch(error => response.status(Http.Conflict).json(error));
                  response.json(adminComplete);
                })
                .catch(error => response.status(Http.UnprocessableEntity).json(error));
            })
            .catch(error => response.status(Http.UnprocessableEntity).json(error));
        }
      });
  },
  destroy(request, response) {
    const { admin_id: adminId } = request.params;
    Admin.findByIdAndRemove(adminId)
      .then(adminInfo => {
        if (!adminInfo) {
          return response.status(404).json(`Review with the id: ${adminId} was not found...`);
        }
        gfsT.delete(adminInfo.profilePicture, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          }
        })
        .catch(error => response.status(Http.Conflict).json(error));
        response.json(adminInfo);
      })
      .catch(error => response.status(Http.Conflict).json(error));
  }
};
