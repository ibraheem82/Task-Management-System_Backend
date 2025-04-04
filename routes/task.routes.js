import express from 'express';

import validate from '../validators/validate.js'
import tasksController from '../controllers/task.controller.js';
import taskValidators from '../validators/task.js';
import isUserLoggedIn from '../middlewares/isUserLoggedIn.js';
import upload from '../config/multerConfig.js';
import isUser from '../middlewares/isUser.js';

const TasksRouter = express.Router();


TasksRouter.post('', isUserLoggedIn, isUser,upload, taskValidators.createTaskValidator, validate, tasksController.createTask);
TasksRouter.put('/:taskId', isUserLoggedIn, isUser, tasksController.updateTask);
TasksRouter.delete("/:taskId", isUserLoggedIn, isUser, tasksController.deleteTask);
TasksRouter.patch("/:taskId/status", isUserLoggedIn, isUser, tasksController.updateTaskStatus);


export default TasksRouter;