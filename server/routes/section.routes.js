const { SectionController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/all', SectionController.index)
  .post('/create', SectionController.create)
  .get('/image/:section_id', SectionController.showImage)
  .get('/single/:section_id', SectionController.show)
  .put('/update/:section_id', SectionController.update)
  .delete('/destroy/:section_id', SectionController.destroy)
