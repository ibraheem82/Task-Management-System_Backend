import express from 'express';
import userValidators from '../validators/auth.js';
import validate from '../validators/validate.js'
import usersController from '../controllers/user.controller.js';

const UsersRouter = express.Router();


UsersRouter.post('/register', userValidators.signupValidator, validate, usersController.register);
UsersRouter.post('/login', userValidators.loginValidator, validate, usersController.login);

export default UsersRouter;