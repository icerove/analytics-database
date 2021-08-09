const { Router } = require('express');
const { body } = require('express-validator');

const { validationErrorHandler } = require('./error');
const { pool, sql } = require('../db');

const { createToken } = require('../lib/jwt');

const rejectUsernameExists = (username) => {
  return pool.query(sql.findUser({ username })).then((res) => {
    if (res.rows.length != 0) {
      return Promise.reject('Username already in use');
    }
  });
};

const usernameNotExistsValidator = body('username')
  .trim()
  .custom(rejectUsernameExists);

const rejectEmailExists = (email) => {
  return pool.query(sql.findUserByEmail({ email })).then((res) => {
    if (res.rows.length != 0) {
      return Promise.reject('Email already in use');
    }
  });
};

const emailNotExistValidator = body('email').trim().custom(rejectEmailExists);

const emailExists = (email) => {
  return pool.query(sql.findUserByEmail({ email })).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject('Email do not exist');
    }
  });
};

const emailExistValidator = body('email').trim().custom(emailExists);

const checkUsernamePassword = (password, { req }) => {
  return pool
    .query(sql.checkPassword({ username: req.body.username, password }))
    .then((res) => {
      if (res.rows.length == 0) {
        return Promise.reject("Username doesn't exist or wrong password");
      }
      req.user = res.rows[0];
    });
};

const passwordCorrectValidator = body('password')
  .trim()
  .custom(checkUsernamePassword);

const usernameValidator = body('username')
  .trim()
  .matches(/^[\w\.\-_]+$/)
  .withMessage("Can only include letters, numbers, '_', '-' and '.'")
  .isLength({ min: 2 })
  .withMessage('Must be at least 2 characters long');

const emailValidator = body('email')
  .trim()
  .isEmail()
  .withMessage('Must be an email address')
  .normalizeEmail();

const passwordValidator = body('password')
  .trim()
  .matches(/\d/)
  .withMessage('Must contains a number')
  .matches(/[a-zA-Z]/)
  .withMessage('Must contains a letter')
  .isLength({ min: 8 })
  .withMessage('Must be at least 8 characters long');

const signupValidator = [
  usernameValidator,
  emailValidator,
  passwordValidator,
  usernameNotExistsValidator,
  emailNotExistValidator,
];

const signup = async (req, res) => {
  result = await pool.query(sql.createUser(req.body));
  res.status(200).json({
    token: createToken({
      username: req.body.username,
      userid: result.rows[0].user_id,
    }),
    username: req.body.username,
  });
};

const loginValidator = [
  usernameValidator,
  passwordValidator,
  passwordCorrectValidator,
];

const login = (req, res) => {
  res.json({
    token: createToken({
      username: req.body.username,
      userid: req.user.user_id,
    }),
    username: req.body.username,
  });
};

const resetPasswordValidator = [emailExistValidator, passwordValidator];

const resetPassword = async (req, res) => {
  password = req.body.password;
  email = req.body.email;

  await pool.query(sql.resetPassword(password, email));
  res.json('password is reset');
};

const router = new Router();
router.post('/signup', signupValidator, validationErrorHandler, signup);
router.post('/login', loginValidator, validationErrorHandler, login);
router.post(
  '/reset-password',
  resetPasswordValidator,
  validationErrorHandler,
  resetPassword
);
module.exports = router;
