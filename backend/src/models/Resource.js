import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    fileUrl: { type: String, required: true },
    fileId: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["pdf", "ppt", "doc", "txt", "image"],
      required: true,
    },
    fileSize: { type: Number, required: true },

    subject: { type: String, required: true, trim: true },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    course: { type: String, required: true, trim: true },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    institute: { type: String, required: true, trim: true },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    downloads: { type: Number, default: 0 },
    upvotes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Resource", resourceSchema);
