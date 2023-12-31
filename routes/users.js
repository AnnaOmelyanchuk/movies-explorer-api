const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');

users.get('/users/me', celebrate({
  body: Joi.object().keys({

  }),
}), getUser);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = users;
