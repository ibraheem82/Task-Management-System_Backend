import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { hashPassword } from '../utils/helpers.js';
import generateToken from '../utils/generateToken.js';


const usersController = {
  /**
   * @desc    Register a new user
   * @route   POST /api/users/register
   * @access  Public
   */
  register: asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email or username');
    }

     // Hash password 
     const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
  }),

  /**
   * @desc    Authenticate user & get token
   * @route   POST /api/users/login
   * @access  Public
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  }),


  /**
   * @desc    Update user profile
   * @route   PUT /api/users/profile
   * @access  Private
   */
  updateProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id)
    });
  }),

  /**
   * @desc    Get all users (Admin only)
   * @route   GET /api/users
   * @access  Private/Admin
   */
  getUsers: asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  }),

  /**
   * @desc    Assign task to user
   * @route   PUT /api/users/:userId/assign-task
   * @access  Private
   */
  assignTask: asyncHandler(async (req, res) => {
    const { taskId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { assignedTasks: taskId } },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  })
};

export default usersController;