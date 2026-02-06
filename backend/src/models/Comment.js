import mongoose from "mongoose";

const Commentschema = new mongoose.Schema(
  {
    message: {
      type: String,
      required:true,
      trim:true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", Commentschema);
