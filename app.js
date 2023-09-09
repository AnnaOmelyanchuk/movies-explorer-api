require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { auth } = require('./middlewares/auth');
const NotFoundError = require('./error/not_found_error_404');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { MONG_DB } = process.env;

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`${MONG_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', auth);

app.use('/', require('./routes/movies'));

app.use('/', require('./routes/users'));

app.use((req, res, next) => {
  next(new NotFoundError('Не туда:('));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
