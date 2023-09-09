const mongoose = require('mongoose');
const validators = require('mongoose-validators');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../error/unauthorized_error_401');
const BadRequesError = require('../error/bad_request_error_400');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Обязательное поле'],
    select: false,
  },
  name:
  {
    type: String,
    minlength: [2, 'минимальное количество символов - 2'],
    maxlength: [30, 'максимальное количество символов - 30'],
    required: [true, 'Обязательное поле'],
  },

  email: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate: validators.isEmail(),
    unique: true,
  },

});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      if (!password) {
        return Promise.reject(new BadRequesError('Пароль не введен'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('users', userSchema);
