import mongoose from "mongoose";

const postschema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    cover: {
      type: String,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    cid: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postschema);
