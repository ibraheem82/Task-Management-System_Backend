import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, select: false, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
