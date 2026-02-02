import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { isValidObjectId } from "mongoose";

export const getprofile = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  try {
    if (req.user.id !== id) {
      return res.status(400).json({ msg: "unauthorized" });
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

export const EditProfile = async (req, res) => {
  try {
    const { bio, name, semester, batch, course } = req.validatedBody;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    if (req.user.id !== id) {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    let uploadResult;

    if (req.file) {
      try {
        if (user.cloudinaryid) {
          await cloudinary.uploader.destroy(user.cloudinaryid, {
            resource_type: "image",
          });
        }
        uploadResult = await uploadToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ msg: "image upload error" });
      }
    }

    const fileldtoupdate = {};
    if (bio !== undefined) fileldtoupdate.bio = bio;
    if (name !== undefined) fileldtoupdate.name = name;
    if (semester !== undefined) fileldtoupdate.semester = semester;
    if (batch !== undefined) fileldtoupdate.batch = batch;
    if (course !== undefined) fileldtoupdate.course = course;
    if (uploadResult?.secure_url !== undefined)
      fileldtoupdate.image = uploadResult.secure_url;
    if (uploadResult?.public_id !== undefined)
      fileldtoupdate.cloudinaryid = uploadResult.public_id;

    const exists = await User.findOneAndUpdate(
      { _id: id },
      { $set: fileldtoupdate },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!exists) {
      return res.status(404).json({
        message: "user does not exist",
      });
    }

    return res.status(201).json({
      user: {
        id: exists._id,
        name: exists.name,
        image: exists.image,
        cloudinaryid: exists.cloudinaryid,
      },
      message: " profile updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
