const Review = require('mongoose').model('Review');

const { Http } = require('@status/codes');
const path = require('path');

const crypto = require('crypto');
const multer = require('multer');

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://127.0.0.1:27017/m-d';
let gfs;
let gfsT;

const process = require('process');

const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
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
  index(_request, response) {
    Review.find({})
      .then(reviewsInfo => {
        if (!reviewsInfo || reviewsInfo.length === 0) {
          return response.status(404).json(`No Review's was found... ${reviewsInfo}`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
          })
          .then(newFiles => {
            let reviewsComplete = reviewsInfo.map(reviewInfo => {
              let byImage = newFiles.find(reviewFile => reviewInfo.byImage?.toString() === reviewFile._id.toString());
              return {
                _id: reviewInfo._id,
                content: reviewInfo.content,
                likes: reviewInfo.likes,
                writtenBy: reviewInfo.writtenBy,
                byImage: byImage,
                byImagePath: reviewInfo.byImagePath,
                byRating: reviewInfo.byRating,
                oAnswered: reviewInfo.oAnswered,
                oResponse: reviewInfo.oResponse,
                oRDate: reviewInfo.oRDate,
                createdAt: reviewInfo.createdAt,
                updatedAt: reviewInfo.updatedAt,
              };
            });
            response.json(reviewsComplete);
          })
          .catch(error => response.status(Http.InternalServerError).json(error));
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  show(request, response) {
    const { review_id: reviewId } = request.params;
    Review.findOne({_id: reviewId})
      .then(reviewInfo => {
        if(!reviewInfo) {
          return response.status(404).json(`Review with id ${reviewId} not found!`);
        }
        gfs.files.find({_id: reviewInfo.byImage})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
          })
          .then(newFiles => {
            const reviewComplete = {
              _id: reviewInfo._id,
              content: reviewInfo.content,
              likes: reviewInfo.likes,
              writtenBy: reviewInfo.writtenBy,
              byImage: newFiles[0],
              byImagePath: reviewInfo.byImagePath,
              byRating: reviewInfo.byRating,
              oAnswered: reviewInfo.oAnswered,
              oResponse: reviewInfo.oResponse,
              oRDate: reviewInfo.oRDate,
              createdAt: reviewInfo.createdAt,
              updatedAt: reviewInfo.updatedAt,
            };
            response.json(reviewComplete);
          })
          .catch(error => response.status(Http.NotFound).json(error));
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  showImage(request, response) {
    const { review_id: reviewId } = request.params;
    Review.findOne({_id: reviewId})
      .then(reviewInfo => {
        if(!reviewInfo) {
          return response.status(404).json(`Review with id ${reviewId} not found!`);
        }
        return gfsT.openDownloadStream(reviewInfo.byImage).pipe(response);
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('byImage');
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
      let pathFile = `http://127.0.0.1:5000/api/home/reviews/image/${newId}`;
      Review.create({
        _id: newId,
        content: request.body.content,
        writtenBy: request.body.writtenBy,
        byImage: request.file.id,
        byImagePath: pathFile,
        byRating: request.body.byRating,
      })
      .then(reviewInfo => {
        const reviewComplete = reviewInfo.toObject();
        response.json(reviewComplete);
      })
      .catch(error => response.status(Http.UnprocessableEntity).json(error));
    });
  },
  update(request, response) {
    const { review_id: reviewId } = request.params;
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('byImage');
      upload(request, response, (error) => {
        if (request.fileValidationError) {
          return response.send(request.fileValidationError);
        } else if (error instanceof multer.MulterError) {
          return response.send(error);
        } else if (error) {
          return response.send(error);
        } else if (!request.file) {
          Review.findByIdAndUpdate(reviewId, request.body, { new: true, runValidators: true })
            .then(reviewInfo => {
              if (!reviewInfo) {
                return response.status(404).json(`Review with the id: ${reviewId} was not found...`);
              };
              gfs.files.find({_id: reviewInfo.byImage})
                .toArray((err, files) => {
                  if (!files) {
                    return response.status(404).json(err);
                  };
                })
                .then(newFiles => {
                  const reviewComplete = {
                    _id: reviewInfo._id,
                    content: reviewInfo.content,
                    likes: reviewInfo.likes,
                    writtenBy: reviewInfo.writtenBy,
                    byImage: newFiles[0],
                    byImagePath: reviewInfo.byImagePath,
                    byRating: reviewInfo.byRating,
                    oAnswered: reviewInfo.oAnswered,
                    oResponse: reviewInfo.oResponse,
                    oRDate: reviewInfo.oRDate,
                    createdAt: reviewInfo.createdAt,
                    updatedAt: reviewInfo.updatedAt,
                  };
                  response.json(reviewComplete);
                })
                .catch(error => response.status(Http.UnprocessableEntity).json(error));
              })
              .catch(error => response.status(Http.UnprocessableEntity).json(error));
        } else {
          let oldByImage;
          Review.findOne({_id: reviewId})
            .then(reviewInfo => {
              if (!reviewInfo) {
                return response.status(404).json(`No Review was found... ${reviewInfo}`);
              }
              oldByImage = reviewInfo.byImage;
            })
            .catch(error => response.status(Http.NotFound).json(error));
          let pathFile = `http://127.0.0.1:5000/api/home/reviews/image/${reviewId}`;
          let newRequest = {...request.body, byImage: request.file.id, byImagePath: pathFile };
          Review.findByIdAndUpdate(reviewId, newRequest, { new: true, runValidators: true })
            .then(reviewInfo => {
              if (!reviewInfo) {
                return response.status(404).json(`Review with the id: ${reviewId} was not found...`);
              };
              gfs.files.find({_id: reviewInfo.byImage})
                .toArray((err, files) => {
                  if (!files) {
                    return response.status(404).json(err);
                  };
                })
                .then(newFiles => {
                  const reviewComplete = {
                    _id: reviewInfo._id,
                    content: reviewInfo.content,
                    likes: reviewInfo.likes,
                    writtenBy: reviewInfo.writtenBy,
                    byImage: newFiles[0],
                    byImagePath: reviewInfo.byImagePath,
                    byRating: reviewInfo.byRating,
                    oAnswered: reviewInfo.oAnswered,
                    oResponse: reviewInfo.oResponse,
                    oRDate: reviewInfo.oRDate,
                    createdAt: reviewInfo.createdAt,
                    updatedAt: reviewInfo.updatedAt,
                  };
                  gfsT.delete(oldByImage, (err, file) => {
                    if (err) {
                      return response.status(Http.Conflict.json(err));
                    };
                  })
                  .catch(error => response.status(Http.Conflict).json(error));
                  response.json(reviewComplete);
                })
                .catch(error => response.status(Http.UnprocessableEntity).json(error));
            })
            .catch(error => response.status(Http.UnprocessableEntity).json(error));
        };
      });
  },
  destroy(request, response) {
    const { review_id: reviewId } = request.params;
    Review.findByIdAndRemove(reviewId)
      .then(reviewInfo => {
        if (!reviewInfo) {
          return response.status(404).json(`Review with the id: ${reviewId} was not found...`);
        }
        gfsT.delete(reviewInfo.byImage, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          };
        })
        .catch(error => response.status(Http.Conflict).json(error));
        response.json(reviewInfo);
      })
      .catch(error => response.status(Http.Conflict).json(error));
  },
};
