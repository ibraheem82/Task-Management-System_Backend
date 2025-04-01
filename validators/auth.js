import { check } from 'express-validator';

const userValidators = {
  signupValidator: [
    check('firstName')
      .notEmpty().withMessage('First name is required').bail()
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage('First name must be between 2-50 characters').bail()
      .matches(/^[a-zA-Z]+$/).withMessage('First name can only contain letters'),

    check('lastName')
      .notEmpty().withMessage('Last name is required').bail()
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage('Last name must be between 2-50 characters').bail()
      .matches(/^[a-zA-Z]+$/).withMessage('Last name can only contain letters'),

    check('username')
      .notEmpty().withMessage('Username is required').bail()
      .trim()
      .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters').bail()
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),

    check('email')
      .notEmpty().withMessage('Email is required').bail()
      .trim()
      .isEmail().withMessage('Invalid email format').bail()
      .normalizeEmail(),

    check('password')
      .notEmpty().withMessage('Password is required').bail()
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').bail()
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter').bail()
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter').bail()
      .matches(/[0-9]/).withMessage('Password must contain at least one number').bail()
      .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
  ],

  loginValidator: [
    check('email')
      .notEmpty().withMessage('Email is required').bail()
      .trim()
      .isEmail().withMessage('Invalid email format'),

    check('password')
      .notEmpty().withMessage('Password is required')
  ],
};

export default userValidators;