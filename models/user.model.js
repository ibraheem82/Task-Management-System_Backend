import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true, // Ensures emails are stored in lowercase
    },

    password: {
      type: String,
      select: false, // Prevents password from being returned in queries
    },

    role: {
      type: String,
      enum: ['user', 'admin',],
      default: 'user',
    },

    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],

    createdTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
