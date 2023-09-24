const movies = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

movies.get('/movies', celebrate({

  body: Joi.object().keys({

  }),
}), getMovies);

movies.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
  body: Joi.object().keys({

  }),
}), deleteMovie);

movies.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')).required(),
    trailerLink: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')).required(),
    thumbnail: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);

module.exports = movies;
