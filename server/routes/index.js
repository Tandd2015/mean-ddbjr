const router = require('express').Router();
const apiRouter = require('express').Router();
const apiRoutes = require('./api.routes');

const adminRoutes = require('./admin.routes');
const reviewRoutes = require('./review.routes');
const postRoutes = require('./post.routes');
const sectionRoutes = require('./section.routes');

const catchAllRoutes = require('./catch-all.routes');

router
  .use('/home/admin', adminRoutes)
  .use('/home/apiRoutes', apiRoutes)
  .use('/home/reviews', reviewRoutes)
  .use('/home/posts', postRoutes)
  .use('/home/sections', sectionRoutes)
module.exports = apiRouter.use('/api', router).use(catchAllRoutes);
