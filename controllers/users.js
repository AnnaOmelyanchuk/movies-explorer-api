const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequesError = require('../error/bad_request_error_400');
const ConflictError = require('../error/conflict_error-409');

module.exports.createUser = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequesError('Пароль не введен');
  }
  if (!email) {
    throw new BadRequesError('email не введен');
  }
  if (!name) {
    throw new BadRequesError('Имя не введено');
  } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => Users.create({
        name,
        email,
        password: hash,
      }))
      .then(() => {
        res.status(201).send({
          name,
          email,
        });
      })
      .catch((err) => {
        if (err.name === 'MongoError' || err.code === 11000) {
          next(new ConflictError('Указанный email уже занят'));
          return;
        }
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequesError('Ошибка в данных'));
          return;
        }
        next(err);
      });
  }
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequesError('Ошибка в данных'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new BadRequesError('Нет такого пользователя');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
        return;
      }
      next(err);
    });
};
