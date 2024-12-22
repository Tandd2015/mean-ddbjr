const { ReviewController } = require('../controllers');
const router = require('express').Router();

module.exports = router
// .get('/google', ReviewController.indexGoogle)
  .get('/all', ReviewController.index)
  .post('/create', ReviewController.create)
  .get('/image/:review_id', ReviewController.showImage)
  .get('/single/:review_id', ReviewController.show)
  .put('/update/:review_id', ReviewController.update)
  .delete('/destroy/:review_id', ReviewController.destroy)

