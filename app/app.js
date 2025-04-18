import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import UsersRouter from "../routes/user.routes.js";
import TasksRouter from "../routes/task.routes.js";
import AdminsRouter from "../routes/admin.routes.js";

// * Database Connection.
dbConnect();




const app = express();
// parse incoming datas, meaning the datas coming in the {req}, will be converted as json.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users/', UsersRouter);
app.use('/api/tasks', TasksRouter);
app.use('/api/admins/', AdminsRouter);










// * Err Middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;