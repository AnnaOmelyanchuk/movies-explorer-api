const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), getMovies);

router.delete('/movies/:movieId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
    movieId: Joi.string().length(24).hex(),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), deleteMovie);

router.post('/movies', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string(),
    image: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')),
    trailerLink: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')),
    thumbnail: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')),
    movieId: Joi.string(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
  }),
}), postMovie);

module.exports = router;
