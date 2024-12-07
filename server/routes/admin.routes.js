const { AuthController, AdminController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .post('/login', AuthController.login)
  .post('/register', AuthController.register)
  .post('/logout', AuthController.logout)
  .get('/all', AdminController.index)
  .get('/single/:admin_id', AdminController.show)
  .get('/image/:admin_id', AdminController.showImage)
  .put('/update/:admin_id', AdminController.update)
  .delete('/destroy/:admin_id', AdminController.destroy)
