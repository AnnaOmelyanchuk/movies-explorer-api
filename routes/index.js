const routes = require('express').Router();
const authorization = require('./authorization');
const { auth } = require('../middlewares/auth');
const movies = require('./movies');
const users = require('./users');
const wrong = require('./wrongRequest');

routes.use('/', authorization);

routes.use(auth);

routes.use('/', users);
routes.use('/', movies);

routes.use('*', wrong);

module.exports = routes;
