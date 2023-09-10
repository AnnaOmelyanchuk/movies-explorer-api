const wrong = require('express').Router();
const NotFoundError = require('../error/not_found_error_404');

wrong.use('*', () => {
  throw new NotFoundError('Не туда:(');
});

module.exports = wrong;
