const { ApiController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/', ApiController.getGoogleMapsApiKey)
