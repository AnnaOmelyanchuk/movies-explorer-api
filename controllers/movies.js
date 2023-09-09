const { default: mongoose } = require('mongoose');
const Movies = require('../models/movies');

const BadRequesError = require('../error/bad_request_error_400');
const NotFoundError = require('../error/not_found_error_404');
const ForbiddenError = require('../error/forbidden-error_403');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movies.find({})
    .then((movies) => {
      const filteredMovies = movies.filter((movie) => movie.owner.toHexString() === userId);
      res.send(filteredMovies);
    })
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  Movies.create({
    owner: req.user._id,
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequesError('Ошибка в данных'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  Movies.findById(
    req.params.movieId,
  )
    .then(async (movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с таким id не существует');
      }
      const ownerId = movie.owner.toString();
      if (ownerId === userId) {
        const element = await Movies.deleteOne(movie);
        res.send({ data: element });
      } else throw new ForbiddenError('Фильм не в твоей коллекции:(');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
        return;
      }
      next(err);
    });
};
