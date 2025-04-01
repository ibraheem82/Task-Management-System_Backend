// validate.js
import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }

  // Group errors by field
  const errorMap = {};
  errors.array().forEach(error => {
    if (!errorMap[error.path]) {
      errorMap[error.path] = error.msg;
    }
  });

  return res.status(400).json({
    success: false,
    errors: errorMap
  });
};