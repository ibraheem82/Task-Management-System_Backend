import express from 'express';
import userValidators from '../validators/auth.js';
import validate from '../validators/validate.js'
import adminsController from '../controllers/admin.controller.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAdminLoggedIn from '../middlewares/isAdminLoggedIn.js';
import upload from '../config/multerConfig.js';
import taskValidators from '../validators/task.js';

const AdminsRouter = express.Router();


AdminsRouter.post('/register', userValidators.signupValidator, validate, adminsController.registerAdmin);
AdminsRouter.post('/login', userValidators.loginValidator, validate, adminsController.loginAdmin);
AdminsRouter.get('/tasks', isAdminLoggedIn, isAdmin,  adminsController.getAllTasks);
AdminsRouter.put('/tasks/:taskId', isAdminLoggedIn, isAdmin, upload, taskValidators.createTaskValidator, validate, adminsController.modifyTask);
AdminsRouter.delete('/tasks/:taskId', isAdminLoggedIn, isAdmin, adminsController.deleteTaskAdmin);
export default AdminsRouter;