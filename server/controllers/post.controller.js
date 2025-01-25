const Post = require('mongoose').model('Post');

const { Http } = require('@status/codes');
const path = require('path');

const crypto = require('crypto');
const multer = require('multer');

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://127.0.0.1:27017/m-d';
let gfs;
let gfsP;

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
  gfsP = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: 'uploads'});
});

module.exports = {
  index(request, response) {
    Post.find({})
      .then(postsInfo => {
        if (!postsInfo) {
          return response.status(404).json(`No Posts ${postsInfo} was found...`);
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
            let postsComplete = postsInfo.map(postInfo => {
              return {
                ...postInfo.toObject(),
                mainImage: finalFiles(postInfo.mainImage),
                images: finalFiles(postInfo.images),
                videos: finalFiles(postInfo.videos)
              };
            });
            response.json(postsComplete);
          })
          .catch(error => response.status(Http.InternalServerError).json(error));
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  // make sure mainImage works properly with an image in the database prior to current upload
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([{name: 'mainImage', maxCount: 1}, {name: 'images', maxCount: 3}, {name: 'videos', maxCount: 3}]);
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.files) {
        return response.send('Please select correct format of file to upload');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }

      let newId = new mongoose.Types.ObjectId();
      const baseUrl = 'http://127.0.0.1:5000/api/home/posts';
      let processFiles = (files) => {
        let fileArr = [];
        files.forEach((file) => (file = {
          id: new mongoose.Types.ObjectId(file.id),
          path: `${baseUrl}/${newId}/${file.id}`,
          file: file
        }, fileArr.push(file)));
        return fileArr;
      };
      // console.log(request.body)
      let mainImageFile = request.files.mainImage?.[0];
      let mainImage = (mainImageFile) ? new mongoose.Types.ObjectId(mainImageFile.id) : request.body.mainImageO;
      let mainImagePath = (mainImageFile) ? `${baseUrl}/${newId}/${mainImageFile.id}` : `${baseUrl}/${newId}/${request.body.mainImageO}`;
      let images = (request.files.images) ? processFiles(request.files.images) : [];
      let videos = (request.files.videos) ? processFiles(request.files.videos) : [];

      // console.log(mainImageFile, mainImage);
      Post.create({
        _id: newId,
        content: request.body.content,
        category: request.body.category,
        mainImage: mainImage,
        mainImagePath: mainImagePath,
        images: images.map(file => file.id),
        imagesPaths: images.map(file => file.path),
        videos: videos.map(file => file.id),
        videosPaths: videos.map(file => file.path)
      })
      .then(postInfo => {
        const postComplete = postInfo.toObject();
        response.json(postComplete);
      })
      .catch(error => response.status(Http.UnprocessableEntity).json(error));
    });
  },
  show(request, response) {
    const { post_id: postId } = request.params;
    Post.findOne({_id: postId})
      .then(postInfo => {
        if (!postInfo) {
          return response.status(404).json(`Post with the id: ${postId} was not found...`);
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
            const postComplete = {
              ...postInfo.toObject(),
              mainImage: finalFiles(postInfo.mainImage),
              images: finalFiles(postInfo.images),
              videos: finalFiles(postInfo.videos),
            };
            response.json(postComplete);
          })
          .catch(error => response.status(Http.NotFound).json(error));
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  showFile(request, response) {
    const { post_id: postId } = request.params;
    const { mainFile_id: mainFileId } = request.params;
    Post.findOne({_id: postId})
      .then(postInfo => {
        if(!postInfo) {
          return response.status(404).json(`File with the id: ${mainFileId} not found!`);
        };
        gfs.files.find({_id: new mongoose.Types.ObjectId(mainFileId)})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            };
          })
          .then(newFiles => {
            return gfsP.openDownloadStreamByName(newFiles[0].filename).pipe(response);
          })
          .catch(error => response.status(Http.NotFound).json(error));
      })
      .catch(error => response.status(Http.NotFound).json(error));
  },
  update(request, response) {
    const { post_id: postId } = request.params;
    const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([{name: 'mainImage', maxCount: 1}, {name: 'images', maxCount: 3}, {name: 'videos', maxCount: 3}]);
    upload(request, response, (error) => {
      let oldPost = JSON.parse(request.body.oldPost);
      delete request.body.oldPost;

      let processFiles = (files) => {
        const baseUrl = 'http://127.0.0.1:5000/api/home/posts';
        let newFiles = Array.isArray(files) ? files : [files];
        let idArr = [];
        let pathArr = [];
        let fileArr = [];
        newFiles.forEach(file => {
          idArr.push(new mongoose.Types.ObjectId(file.id));
          fileArr.push(file);
          pathArr.push(`${baseUrl}/${postId}/${file.id}`);
        });
        return [idArr, fileArr, pathArr];
      };

      let deleteFiles = (post, oldPost) => {
        if (oldPost.images[0]?._id.toString() !== post.images[0]?._id.toString()) {
          oldPost.images.forEach((file) => {
            gfsP.delete(new mongoose.Types.ObjectId(file._id));
          });
        };
        if (oldPost.videos[0]?._id.toString() !== post.videos[0]?._id.toString()) {
          oldPost.videos.forEach((file) => {
            gfsP.delete(new mongoose.Types.ObjectId(file._id));
          });
        };
        if (oldPost.mainImage?._id.toString() !== post.mainImage?.toString()) {
          gfsP.delete(new mongoose.Types.ObjectId(oldPost.mainImage._id));
        };
      };

      let finalFiles = (post, files) => {
        let fileMap = new Map();
        files.forEach(file => fileMap.set(file._id.toString(), file));
        let images = post.images.map(id => fileMap.get(id.toString())).filter(Boolean);
        let videos = post.videos.map(id => fileMap.get(id.toString())).filter(Boolean);
        let mainImage = fileMap.get(post.mainImage.toString()) ? [fileMap.get(post.mainImage.toString())] : [];
        return [images, videos, mainImage];
      };

      let requestFiles = (request, oldPost) => {
        (request.files.images) ? request.files.images = processFiles(request.files.images) : request.body.images = oldPost.images;
        if (request.files.images) {
          request.body.images = request.files.images[0];
          request.body.imagesPaths = request.files.images[request.files.images.length-1];
        };

        (request.files.videos) ? request.files.videos = processFiles(request.files.videos) : request.body.videos = oldPost.videos;
        if (request.files.videos) {
          request.body.videos = request.files.videos[0];
          request.body.videosPaths = request.files.videos[request.files.videos.length-1];
        };

        (request.files.mainImage?.[0]) ? request.files.mainImage =  processFiles(request.files.mainImage?.[0]) : request.body.mainImage = oldPost.mainImage;
        if (request.files.mainImage?.[0]) {
          request.body.mainImage = request.files.mainImage[0];
          request.body.mainImagePath = request.files.mainImage[request.files.mainImage.length-1][0]
        };
      }

      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      } else if(!request.files || Object.keys(request.files).length === 0) {
        Post.findByIdAndUpdate(postId, request.body, { new: true, runValidators: true })
          .then(postInfo => {
            if (!postInfo) {
              return response.status(404).json(`Post with the id: ${postId} was not found...`);
            };
            gfs.files.find({})
              .toArray((err, files) => {
                if (!files) {
                  return response.status(404).json(err);
                };
              })
              .then(newFiles => {
                let newFilesArr = [{},...newFiles];
                let updatedNewFiles = newFilesArr.reduce((map, file, index) => {
                  map[file._id.toString()] = file;
                  return map;
                });
                let finalFiles = (fileIds) =>
                  Array.isArray(fileIds)
                    ? fileIds.map(id => updatedNewFiles[id.toString()] || id)
                    : updatedNewFiles[fileIds.toString()] || fileIds;
                const postComplete = {
                  ...postInfo.toObject(),
                  mainImage: finalFiles(postInfo.mainImage),
                  images: finalFiles(postInfo.images),
                  videos: finalFiles(postInfo.videos),
                };
                response.json(postComplete);
              })
              .catch(error => response.status(Http.UnprocessableEntity).json(error));
            })
            .catch(error => response.status(Http.UnprocessableEntity).json(error));
      } else {
        requestFiles(request, oldPost);
        Post.findByIdAndUpdate(postId, request.body, { new: true, runValidators: true })
          .then(postInfo => {
            if (!postInfo) {
              return response.status(404).json(`Post with the id: ${postId} was not found...`);
            }
            gfs.files.find({})
              .toArray((err, files) => {
                if (!files) {
                  return response.status(404).json(err);
                }
                })
                .then(files=> {
                  let finishedFiles = finalFiles(postInfo, files);
                  deleteFiles(postInfo, oldPost);
                  const postComplete = {
                    ...postInfo.toObject(),
                    images: finishedFiles[0],
                    videos: finishedFiles[1],
                    mainImage: finishedFiles[2][0]
                  };
                  response.json(postComplete);
                });
          })
          .catch(error => response.status(Http.UnprocessableEntity).json(error));
      };
    });
  },
  destroy(request, response) {
    const { post_id: postId } = request.params;
    Post.findByIdAndRemove(postId)
      .then(post => {
        if (!post) {
          return response.status(404).json(`Post with the id: ${postId} was not found...`);
        };
        let finalFiles = (fileIds) => {
          let updatedFiles = Array.isArray(fileIds)
            ? fileIds
            : [fileIds];
          updatedFiles.forEach((file) => {
            gfsP.delete(file, (err, file) => {
              if (err) {
                return response.status(Http.Conflict.json(err));
              };
            })
            .catch(error => response.status(Http.Conflict).json(error));
          });
        };
        finalFiles(post.mainImage);
        finalFiles(post.images);
        finalFiles(post.videos);
        response.json(post);
      })
      .catch(error => response.status(Http.Conflict).json(error));
  },
};
