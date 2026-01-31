import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      select: false,
    },
    isverifed: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
    },
    collegeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course: {
      type: String,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userschema);
