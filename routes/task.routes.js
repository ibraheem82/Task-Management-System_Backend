import express from 'express';

import validate from '../validators/validate.js'
import tasksController from '../controllers/task.controller.js';
import taskValidators from '../validators/task.js';
import isUserLoggedIn from '../middlewares/isUserLoggedIn.js';
import upload from '../config/multerConfig.js';


const TasksRouter = express.Router();


TasksRouter.post('', isUserLoggedIn, upload, taskValidators.createTaskValidator, validate, tasksController.createTask);
TasksRouter.put('/:taskId', isUserLoggedIn, tasksController.updateTask);
TasksRouter.delete("/:taskId", isUserLoggedIn, tasksController.deleteTask);
TasksRouter.patch("/:taskId/status", isUserLoggedIn, tasksController.updateTaskStatus);


export default TasksRouter;