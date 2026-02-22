import mongoose from "mongoose";

const Notificationschema = new mongoose.Schema(
  {
    message: {
      type: String,
      required:true,
      trim:true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", Notificationschema);