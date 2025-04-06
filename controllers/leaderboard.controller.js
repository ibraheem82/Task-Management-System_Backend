// leaderboard.controller.js
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

const leaderboardController = {
  /**
   * @desc Get leaderboard ranking users by completed tasks (created or assigned)
   * @route GET /api/leaderboard
   * @access Private (admin or logged-in users)
   */
  getLeaderboard: asyncHandler(async (req, res) => {
    // Get all users
    const users = await User.find();

    // Map and rank users
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const completedCreated = await Task.countDocuments({
          createdBy: user._id,
          status: "Completed",
        });

        const completedAssigned = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        const totalCompleted = completedCreated + completedAssigned;

        return {
          userId: user._id,
          username: user.username,
          fullName: `${user.firstName} ${user.lastName}`,
          completedCreated,
          completedAssigned,
          totalCompleted,
        };
      })
    );

    // Sort leaderboard
    leaderboard.sort((a, b) => b.totalCompleted - a.totalCompleted);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  }),
};

export default leaderboardController;
