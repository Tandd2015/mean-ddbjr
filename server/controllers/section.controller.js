const Section = require('mongoose').model('Section');

const { Http } = require('@status/codes');
const path = require('path');

const crypto = require('crypto');
const multer = require('multer');

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://127.0.0.1:27017/m-d';
let gfs;
let gfsS;

const process = require('process');

const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(mp4|MP4|mov|MOV|wmv|WMV|flv|FLV|avi|AVI|avchd|AVCHD|webm|WEBM|mkv|MKV|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only video or image files are allowed!';
    return cb(new Error('Only video files are allowed!'), false);
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
  gfsS = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: 'uploads'});
});

module.exports = {
  index(request, response) {
    Section.find({})
      .then(sectionsInfo => {
        if (!sectionsInfo) {
          return response.status(404).json(`No Sections ${sectionsInfo} was found...`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            };
          })
          .then(newFiles => {
            let newFilesArr = [{},...newFiles];
            let updatedNewFiles = newFilesArr.reduce((map, file) => {
              map[file._id.toString()] = file;
              return map;
            });
            let finalFiles = (fileIds) =>
              Array.isArray(fileIds)
                ? fileIds.map(id => updatedNewFiles[id.toString()] || id)
                : updatedNewFiles[fileIds.toString()] || fileIds;
            let sectionsComplete = sectionsInfo.map(sectionInfo => {
              return {
                ...sectionInfo.toObject(),
                sectionImage: finalFiles(sectionInfo.sectionImage),
              };
            });
            response.json(sectionsComplete);
          })
          .catch(error => response.status(Http.InternalServerError).json(error));
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single('sectionImage');
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.file) {
        return response.send('Please select an image to upload');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }
      let newId = new mongoose.Types.ObjectId();
      let pathFile = `http://localhost:5000/api/home/sections/image/${newId}`;
      Section.create({
        _id: newId,
        title: request.body.title,
        content: request.body.content,
        sectionImage: request.file.id,
        sectionImagePath: pathFile,
        sectionImageAttributionCredit: request.body.sectionImageAttributionCredit,
        sectionImageAttributionLink: request.body.sectionImageAttributionLink,
      })
      .then(section => {
        const sectionComplete = section.toObject();
        response.json(sectionComplete);
      })
      .catch(error => response.status(Http.UnprocessableEntity).json(error));
    });
  },
  show(request, response) {
    const { section_id: sectionId } = request.params;
    Section.findOne({_id: sectionId})
      .then(sectionInfo => {
        if(!sectionInfo) {
          return response.status(404).json(`Section with the id: ${sectionId} not found!`);
        }
        gfs.files.find({_id: sectionInfo.sectionImage})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
          })
          .then(newFiles => {
            const sectionComplete = {
              ...sectionInfo.toObject(),
              sectionImage: newFiles[0],
            };
            response.json(sectionComplete);
          })
          .catch(error => response.status(Http.NotFound).json(error));
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  showImage(request, response) {
    const { section_id: sectionId } = request.params;
    Section.findOne({_id: sectionId})
      .then(sectionInfo => {
        if(!sectionInfo) {
          return response.status(404).json(`Section with the id: ${sectionId} not found!`);
        }
        return gfsS.openDownloadStream(sectionInfo.sectionImage).pipe(response);
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  update(request, response) {
    const { section_id: sectionId } = request.params;
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single('sectionImage');
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      } else if (!request.file) {
        Section.findByIdAndUpdate(sectionId, request.body, { new: true, runValidators: true })
          .then(sectionInfo => {
            if (!sectionInfo) {
              return response.status(404).json(`Section with the id: ${sectionId} was not found...`);
            };
            gfs.files.find({_id: sectionInfo.sectionImage})
              .toArray((err, files) => {
                if (!files) {
                  return response.status(404).json(err);
                };
              })
              .then(newFiles => {
                const sectionComplete = {
                  ...sectionInfo.toObject(),
                  sectionImage: newFiles[0],
                };
                response.json(sectionComplete);
              })
              .catch(error => response.status(Http.UnprocessableEntity).json(error));
            })
            .catch(error => response.status(Http.UnprocessableEntity).json(error));
      } else {
        let oldSectionImage;
        Section.findOne({_id: sectionId})
          .then(sectionInfo => {
            if (!sectionInfo) {
              return response.status(404).json(`Section with the id: ${sectionId} was not found...`);
            }
            oldSectionImage = sectionInfo.sectionImage;
          })
          .catch(error => response.status(Http.NotFound).json(error));
        let pathFile = `http://127.0.0.1:5000/api/home/sections/image/${sectionId}`;
        let newRequest = {...request.body, sectionImage: request.file.id, sectionImagePath: pathFile };
        Section.findByIdAndUpdate(sectionId, newRequest, { new: true, runValidators: true })
          .then(sectionInfo => {
            if (!sectionInfo) {
              return response.status(404).json(`Section with the id: ${sectionId} was not found...`);
            };
            gfs.files.find({_id: sectionInfo.sectionImage})
              .toArray((err, files) => {
                if (!files) {
                  return response.status(404).json(err);
                };
              })
              .then(newFiles => {
                const sectionComplete = {
                  ...sectionInfo.toObject(),
                  sectionImage: newFiles[0],
                };
                gfsS.delete(oldSectionImage, (err, file) => {
                  if (err) {
                    return response.status(Http.Conflict.json(err));
                  };
                })
                .catch(error => response.status(Http.Conflict).json(error));
                response.json(sectionComplete);
              })
              .catch(error => response.status(Http.UnprocessableEntity).json(error));
          })
          .catch(error => response.status(Http.UnprocessableEntity).json(error));
      };
    });
  },
  destroy(request, response) {
    const { section_id: sectionId } = request.params;
    Section.findByIdAndRemove(sectionId)
      .then(sectionInfo => {
        if (!sectionInfo) {
          return response.status(404).json(`Section with the id: ${sectionId} was not found...`);
        }
        gfsS.delete(sectionInfo.sectionImage, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          };
        })
        .catch(error => response.status(Http.Conflict).json(error));
        response.json(sectionInfo);
      })
      .catch(error => response.status(Http.Conflict).json(error));
  }
}
