
const Admin = require('mongoose').model('Admin');
const ReviewGoogle = require('mongoose').model('ReviewGoogle');

const { Http } = require('@status/codes');
const path = require('path');

const puppeteer = require('puppeteer');
const crypto = require('crypto');
const multer = require('multer');

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://127.0.0.1:27017/m-d';
let gfs;
let gfsT;

const process = require('process');
const reviewUrl = '';
const altORDate = 'Dragon-Onyx Software Solutions has not yet responded to customer review.';
let reviewProcessStop = false;

const deleteAll = () => {
  ReviewGoogle.find({})
    .then(reviews => {
      if (reviews.length === 0) {
        return console.log(`No Reviews found...`);
      }
      console.log("deleteAll Function", reviews[0]);
      for (let idx = 0; idx < reviews.length; idx++) {
        ReviewGoogle.findByIdAndRemove(reviews[idx]._id)
          .then(review => {
            if (!review) {
              return console.log(`ReviewGoogle with the id: ${review._id} was not found... \n`);
            }
          })
          .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
};

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


const createAllReviews = (reviews) => {
  return new Promise((resolve, reject) => {
    let createdReviewsHolder = [];
    for(let idx = 0; idx < reviews.length; idx++) {
      let newId = new mongoose.Types.ObjectId();
      ReviewGoogle.create({
        _id: newId,
        content: reviews[idx].content,
        writtenBy: reviews[idx].writtenBy,
        likes: reviews[idx].likes,
        byImage: reviews[idx].byImage,
        byContribute: reviews[idx].byContribute,
        byContributeLink: reviews[idx].byContributeLink,
        byRating: reviews[idx].byRating,
        byDate: reviews[idx].byDate,
        oResponse: reviews[idx].oResponse,
        oRDate: reviews[idx].oRDate
      })
        .then(createdReviews => {
          createdReviewsHolder.push(createdReviews)
          if(idx === reviews.length - 1){
            resolve(createdReviewsHolder);
          }
        })
        .catch(error => {
          const errors = Object.keys(error.errors).map(key => error.errors[key].message);
          console.log('createAllReviews() -- .catch() - ReviewGoogle created unsuccessfully', errors, '\n');
          resolve([]);
        });
    };
  });
};

module.exports = {
  // Admin Controller
  showImage(request, response) {
    const { admin_id: adminId } = request.params;
    Admin.findOne({_id: adminId})
    .then(adminInfo => {
      if (!adminInfo) {
        return response.status(404).json(`No Administrator was found... ${adminInfo}`);
      }
      gfs.files.find({ _id: adminInfo.profilePicture })
        .toArray((err, files) => {
          if (!files) {
            return response.status(404).json(err);
          }
        })
        .then(newFiles => {
          return gfsT.openDownloadStreamByName(newFiles[0].filename).pipe(response);
        })
        .catch(error => response.status(Http.NotFound).json(error));
    })
    .catch(error => response.status(Http.NotFound).json(error));
  },
  destroy(request, response) {
    const { admin_id: adminId } = request.params;
    Admin.findByIdAndRemove(adminId)
      .then(adminInfo => {
        if (!adminInfo) {
          return response.status(404).json(`Review with the id: ${adminId} was not found...`);
        }
        gfs.files.find({ _id: adminInfo.profilePicture }).toArray((err, files) => {
          if (err) {
            return response.status(500).json({ message: 'Error retrieving files from GridFS.', error: err });
          }
        })
        .then(newFiles => {
          gfsT.delete(adminInfo.profilePicture, (err, file) => {
            if (err) {
              return response.status(Http.Conflict.json(err));
            }
          })
          console.log('destroy',newFiles);
          response.json(adminInfo);
        })
      })
      .catch(error => response.status(Http.Conflict).json(error));
  },
// Review Controller
  indexGoogle(request, response) {
    if (reviewProcessStop === true) {
      throw new Error(`indexGoogle() -- If statement 1 - Failed to navigate to ${reviewUrl} due to reviewProcessStop state ${reviewProcessStop}.`);
    };

    reviewProcessStop = true;

    const currentTime = Date.now();
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
    let timeOutR;
    let timeOutR2;
    let lastExecutionTimestamp;
    let retryReview = 15;
    let whileLoopStop = false;

    const thisProcessRemoverReview = () => {
      ['exit', 'SIGINT', 'SIGTERM', 'SIGHUP'].forEach(event => process.removeAllListeners(event));
    };

    const timeOutReview = async (ms) => {
      return new Promise((resolve, reject) => {
        timeOutR2 = setInterval(() => {
          if (whileLoopStop) {
            clearInterval(timeOutR2);
            resolve([]);
          }
        }, 1000);
        timeOutR = setTimeout(() => {
          clearInterval(timeOutR2);
          resolve([]);
        }, ms);
      });
    };

    const thisTimeOutReviewStop = () => {
      whileLoopStop = true;
      clearTimeout(timeOutR);
    }

    const timeOutPromiseReview = timeOutReview(180000).catch();

    const deleteAllManualReviews = (reviews) => {
      if (reviews.length === 0) {
        return console.log('deleteAllManualReviews -- If statement 1 - No Reviews found to Delete.', reviews, '\n');
      }
      for (let idx = 0; idx < reviews.length; idx++) {
        ReviewGoogle.findByIdAndRemove(reviews[idx]._id)
          .then(review => {
            if (!review) {
              console.log(`deleteAllManualReviews - ReviewGoogle.findByIdAndRemove() -- If Statement 1 - Review with the id: ${review._id} was not found... \n`);
            }
          })
          .catch(error => console.log(`deleteAllManualReviews - ReviewGoogle.findByIdAndRemove() -- .catch() - Review with the id: ${review._id} was not found... \n`, error, '\n'));
      }
    };

    const retryItReviews = async (reviewUrl, retryC) => {
      thisProcessRemoverReview();
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();

      if (retryC < 0) {
        throw new Error(`retryItReviews -- If Statement 1 - Failed to navigate to ${reviewUrl} after maximum allowed attempts. \n`);
      }

      return await Promise.race([Promise.all([
        await browser,
        await page,
        await page.goto(reviewUrl, {
          waitUntil: 'load',
          timeout: 600000
        }),
        await page.waitForNavigation({
          waitUntil: ['load', "networkidle2"],
          timeout: 600000
        }),
        await page.waitForResponse(responses => responses.ok()),
        await page.evaluate(() => {
          const selectors = {
            imageClass: 'NBa7we',
            userReviewSInfoclass: 'jftiEf fontBodyMedium',
            // userReviewSInfoclass: 'jftiEf L6Bbsd fontBodyMedium',
            ratingClass: 'kvMYJc',
            userReviewSLinkclass: 'WNxzHc qLhwHc'
          };
          const arrMaker = (arrSelector) => {
            const newArr = [];
            const contentArr = document.getElementsByClassName(arrSelector);
            for (let item of contentArr) {
              if (arrSelector === selectors.imageClass) {
                newArr.push(item.getAttribute('src'));
              } else if (arrSelector === selectors.ratingClass) {
                newArr.push(item.getAttribute('aria-label'));
              } else if (arrSelector === selectors.userReviewSInfoclass) {
                newArr.push(item.innerText.split('\n'));
              } else if (arrSelector === selectors.userReviewSLinkclass) {
                newArr.push(item.querySelector('button').getAttribute('data-href'));
              } else {
                newArr.push(item.innerText);
              }
            }
            return newArr;
          };
          const duplicateCheck = (subject1, subject2) => {
            const cleanedSubject1 = subject1.map(item => item === '   ' ? '' : item);
            return subject2.filter(item => !cleanedSubject1.includes(item));
          };
          const reviewSplitter = (reviewsObject) => {
            const reviewArr = [];
            const strTwo = ' ';
            for (let ind = 0; ind < reviewsObject.info.length; ind++) {
              const newReview = {
                content: reviewsObject.content[ind] || 'No written user text review.',
                writtenBy: reviewsObject.writtenBy[ind],
                likes: reviewsObject.likes[ind] || '0',
                byImage: reviewsObject.byImage[ind],
                byContribute: reviewsObject.byContribute[ind] || '0 reviews',
                byContributeLink: reviewsObject.byContributeLink[ind],
                byRating: reviewsObject.byRating[ind],
                byRating: reviewsObject.byRating[ind]?.split(strTwo[0], 2)[0],
                byDate: reviewsObject.byDate[ind],
                oResponse: reviewsObject.oResponse[ind] || 'No owner response for the review.',
                oRDate: reviewsObject.oRDate[ind] || 'No owner response date for the review.'
              };
              reviewArr.push(newReview);
            }
            return reviewArr;
          };
          const getAllSReviews = () => {
            let content = arrMaker('MyEned');
            let oResponse = arrMaker('wiI7pd');
            oResponse = duplicateCheck(content, oResponse);
            return {
              info: arrMaker(selectors.userReviewSInfoclass),
              content: content,
              writtenBy: arrMaker('d4r55'),
              likes: arrMaker('pkWtMe'),
              byImage: arrMaker(selectors.imageClass),
              byContribute: arrMaker('RfnDt'),
              byContributeLink: arrMaker(selectors.userReviewSLinkclass),
              byRating: arrMaker(selectors.ratingClass),
              byDate: arrMaker('rsqaWe'),
              oResponse: oResponse,
              oRDate: arrMaker('ODSEW-ShBeI-QClCJf-QYOpke-header')
            };
          };
          return reviewSplitter(getAllSReviews());
        }),
        await browser.close(),
      ]), timeOutPromiseReview
      ])
      .then((tryResponseReview) => {
        return new Promise((resolve, reject) => {
          if (tryResponseReview[tryResponseReview.length-2] !== undefined) {
            ReviewGoogle.find({})
              .then(reviews => {
                deleteAllManualReviews(reviews);
                createAllReviews(tryResponseReview[tryResponseReview.length-2])
                  .then(newReviews => {
                    resolve(newReviews);
                  })
                  .catch(error => {
                    console.log('retryItReviews - createAllReviews -- .then-1 -- .catch-1 \n', error);
                    resolve([]);
                  });
              })
              .catch(error => {
                console.log('retryItReviews - ReviewGoogle.find({}) -- .catch-1 \n', error);
                resolve([]);
              });
          };
          if (tryResponseReview[tryResponseReview.length-2] === undefined) {
            resolve([]);
          };
        });
      })
      .catch((e) => {
        return new Promise((resolve, reject) => {
          console.log(`retryItReviews -- .catch-1 ${e} occurred resulting in the failed to navigation to ${reviewUrl}, ${retryC-1} attempts left.`);
          resolve([]);
        })
      })
      .finally(() => {
        thisProcessRemoverReview();
        thisTimeOutReviewStop();
      })
    };
    ReviewGoogle.find({})
      .then(reviews => {
        reviewProcessStop = false;
        if (reviews.length !== 0) {
          lastExecutionTimestamp = reviews[0].createdAt;
        } else {
          lastExecutionTimestamp = 0;
        };

        if (currentTime - lastExecutionTimestamp < oneWeekInMillis) {
          response.json(reviews);
        } else {
          reviewProcessStop = false;
          retryItReviews(reviewUrl, retryReview)
            .then(rev => {
              response.json(rev);
            })
            .catch((err) => {
              console.log('ReviewGoogle.find({}) - retryItReviews - createAllReviews -- .catch-1', err, '\n', 'retryReview', retryReview, '\n');
              throw new Error(err)
            })
            .finally(() => {
              retryReview -= 1;
              thisTimeOutReviewStop();
              thisProcessRemoverReview();
              reviewProcessStop = false;
            })
        };
      })
      .catch(error => response.status(Http.InternalServerError).json(error));

  },
};


async function getGoogleMapsApiKey(request, response) {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    response.status(500).send('Google Maps API key is not configured');
    return;
  };
  response.json(googleMapsApiKey);
}

'<script>'
  async function loadGoogleMapsAPITwoo() {
    const response = await fetch('api/home/apiRoutes');
    const scriptText = await response.text();
    return new Promise((resolve, reject) => {
      resolve(scriptText);
    });
  };
  loadGoogleMapsAPITwoo()
    .then((response)=> {
      let googleMapsApiKey = response.replace(/['"]/g, '');
      (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https:map  {c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
      ({key: `${googleMapsApiKey}`, v: "weekly"});
    })
    .catch(error => {
      console.error('Failed to load Google Maps API:', error);
    });
'</script>'
