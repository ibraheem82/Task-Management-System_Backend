import asyncHandler from "express-async-handler";
import Task from "../models/task.model.js";
import cloudinary from "../config/cloudinaryConfig.js";
import User from "../models/user.model.js";
import { bufferToBase64 } from "../utils/imageToBase64.js";



const tasksController = {
  /**
   * @desc    Create a new task
   * @route   POST /api/tasks
   * @access  Private (Authenticated users)
   */
  createTask: asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    let imageUrl = null;

    if (req.file) {
      try {
        const base64Image = bufferToBase64(req.file.buffer);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: "task_Images",
          resource_type: "auto",
        });


        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image. Please try again later.",
          error: { message: error.message },
        });
      }
    }

    try {
      const user = await User.findById(req.userAuth._id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const task = await Task.create({
        title,
        description,
        status: status || "To Do",
        priority: priority || "Medium",
        dueDate,
        image: imageUrl,
        createdBy: req.userAuth._id,
        assignedTo: assignedTo || null,
      });
    
        // Update user's `createdTasks` array
        user.createdTasks.push(task._id);
        await user.save();

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      console.log("Task creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create task. Please try again later.",
        error: { message: error.message },
      });
    }
  }),



  // Assign Task
  // Only Admins or the creator of the task can assign it.
  assignTask: asyncHandler(async (req, res) => {
    const { taskId, userId } = req.params;

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
  
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User to assign not found',
      });
    }
  
    // If task is already assigned, remove it from the old user's assignedTasks
    if (task.assignedTo && task.assignedTo.toString() !== userId) {
      await User.findByIdAndUpdate(task.assignedTo, {
        $pull: { assignedTasks: task._id },
      });
    }
  
    // Assign task to the user
    task.assignedTo = userId;
    await task.save();
  
    // Add task to user's assignedTasks if not already there
    if (!user.assignedTasks.includes(task._id)) {
      user.assignedTasks.push(task._id);
      await user.save();
    }
  
    res.status(200).json({
      success: true,
      message: 'Task successfully assigned to user',
      data: task,
    });
  }),



  updateTask: asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
  
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
  
    // Check if the logged-in user is the creator of this task
    // Using createdBy instead of user based on your schema
    if (task.createdBy.toString() !== req.userAuth._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only update tasks that you created" 
      });
    }
  
    // Proceed with the update since it's the user's own task
    Object.assign(task, req.body);
    await task.save();
  
    res.status(200).json({ 
      success: true, 
      message: "Task updated successfully", 
      data: task 
    });
  }),

/*
  * @desc Delete a task (only if the user created it)
  * @route DELETE /api/tasks/:taskId
  * @access Private (Only task creator)
  */
 deleteTask: asyncHandler(async (req, res) => {
   const { taskId } = req.params;
   const task = await Task.findById(taskId);

   if (!task) return res.status(404).json({ success: false, message: "Task not found" });

   if (task.createdBy.toString() !== req.userAuth._id.toString()) {
     return res.status(403).json({ success: false, message: "Not authorized to delete this task" });
   }

   await task.deleteOne();

   // Remove task from the user's `createdTasks`
  //  It uses the $pull operator, which is a MongoDB operator that removes all instances of a value from an existing array in a document. In this case, it removes the taskId from the createdTasks array within the user document.
  // $pull: This is a MongoDB update operator. It removes all array elements that match the specified condition.
   await User.findByIdAndUpdate(req.userAuth._id, { $pull: { createdTasks: taskId } });

   res.status(200).json({ success: true, message: "Task deleted successfully" });
 }),


/**
   * Filter and sort tasks
   * /api/tasks?status=To Do&priority=High&sortBy=dueDate
   */
 updateTaskStatus: asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!["To Do", "In Progress", "Completed"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const task = await Task.findById(taskId);

  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const isAuthorized =
    task.createdBy.toString() === req.userAuth._id.toString() ||
    (task.assignedTo && task.assignedTo.toString() === req.userAuth._id.toString());

  if (!isAuthorized) {
    return res.status(403).json({ success: false, message: "Not authorized to update status" });
  }

  task.status = status;
  await task.save();

  res.status(200).json({ success: true, message: "Task status updated successfully", data: task });
}),

filterAndSortTasks: asyncHandler(async (req, res) => {
  const { status, priority, dueDate, sortBy = "dueDate", order = "asc" } = req.query;

  const filter = {
    createdBy: req.userAuth._id, // user can only see their tasks
    ...(status && { status }), // Adds status filter if provided
    ...(priority && { priority }), // Adds priority filter if provided
    ...(dueDate && { dueDate: { $lte: new Date(dueDate) } }),
  };

  // Converts order ("asc" or "desc") into 1 (ascending) or -1 (descending) for MongoDB.
  const sortOrder = order === "desc" ? -1 : 1;

  // Fetches tasks matching the filter criteria.
  // Sorts results by sortBy field (dueDate, priority, etc.) in the specified order.
  const tasks = await Task.find(filter).sort({ [sortBy]: sortOrder });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
}),
};

export default tasksController;
