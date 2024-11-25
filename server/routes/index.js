const router = require('express').Router();
const apiRouter = require('express').Router();

const catchAllRoutes = require('./catch-all.routes.js');

module.exports = apiRouter.use('/api', router).use(catchAllRoutes);
