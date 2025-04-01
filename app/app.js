import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';





// * Database Connection.
dbConnect();
const app = express();










// * Err Middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;