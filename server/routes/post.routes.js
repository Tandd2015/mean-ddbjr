const { PostController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/all', PostController.index)
  .post('/create', PostController.create)
  .get('/image/:post_id/:mainFile_id', PostController.showFile)
  .get('/single/:post_id', PostController.show)
  .put('/update/:post_id', PostController.update)
  .delete('/destroy/:post_id', PostController.destroy)
