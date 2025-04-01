import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true, // Ensures emails are stored in lowercase
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
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
