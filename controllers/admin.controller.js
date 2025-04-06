import asyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js"; // Import Admin model
import { hashPassword } from "../utils/helpers.js";
import generateToken from "../utils/generateToken.js";

const adminsController = {
      /**
   * @desc Register a new admin
   * @route POST /api/admins/register
   * @access Public
   */
  registerAdmin: asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const hashedPassword = await hashPassword(password)

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  }),
  loginAdmin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    

    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token
    });
  }),

  /**
   * @desc Get all tasks (Admins only)
   * @route GET /api/admin/stasks
   * @access Private (Admins only)
   */
  getAllTasks: asyncHandler(async (req, res) => {
    const [tasks, totalTasks] = await Promise.all([
      Task.find().populate("createdBy", "firstName lastName email"),
      Task.countDocuments() // Total tasks in the database
    ]);
  
    res.status(200).json({ 
      success: true, 
      totalTasks, // Total count of all tasks
      data: tasks 
    });
  }),

  /**
   * @desc Modify any task (Admins only)
   * @route PUT /api/admins/tasks/:taskId
   * @access Private (Admins only)
   */
  modifyTask: asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.status(200).json({ success: true, message: "Task modified successfully", data: task });
  }),

  /**
   * @desc Delete any task (Admins only)
   * @route DELETE /api/tasks/:taskId
   * @access Private (Admins only)
   */
  deleteTaskAdmin: asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

     // Remove task from the creator's createdTasks
  await User.updateOne(
    { _id: task.createdBy },
    { $pull: { createdTasks: task._id } }
  );

  // Also remove from assigned user's assignedTasks (if assigned)
  if (task.assignedTo) {
    await User.updateOne(
      { _id: task.assignedTo },
      { $pull: { assignedTasks: task._id } }
    );
  }

    await task.deleteOne();
    res.status(200).json({ success: true, message: "message: 'Task deleted successfully and removed from related users'," });
  }),
};

export default adminsController;
