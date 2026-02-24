import mongoose from "mongoose";
import cloudinary, {
  CoverImageToCloudinary,
  CoverUplaodToCloudinary,
} from "../config/cloudinary.js";
import Group from "../models/Group.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.validatedBody;

    const userid = req.user._id;
    let uploadResult = await CoverImageToCloudinary(req.file.buffer);
    const arr = [];
    arr.push(userid);
    const newGroup = await Group.create({
      name,
      description,
      admin: userid,
      coverimage: uploadResult.secure_url,
      cid: uploadResult.public_id,
      institute: req.user.institute,
      members: arr,
    });

    res.status(201).json({
      group: newGroup,
      message: "Group created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const EditGroup = async (req, res) => {
  try {
    const { name, description } = req.validatedBody;
    const { gid } = req.validatedParams;

    const exists = await Group.findOne({
      admin: req.user._id,
      _id: gid,
    });

    if (exists.institute !== req.user.institute) {
      return res.status(403).json({ error: "Not your college" });
    }

    if (!exists) {
      return res.status(404).json({ message: "post not found" });
    }

    let uploadResult;
    if (req.file) {
      try {
        if (exists.cid) {
          await cloudinary.uploader.destroy(exists.cid, {
            resource_type: "image",
          });
        }
        uploadResult = await CoverImageToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ msg: "image upload error" });
      }
    }

    const fileldtoupdate = {};
    if (name !== undefined) fileldtoupdate.name = name;
    if (description !== undefined) fileldtoupdate.description = description;
    if (uploadResult?.secure_url !== undefined)
      fileldtoupdate.coverimage = uploadResult.secure_url;
    if (uploadResult?.public_id !== undefined)
      fileldtoupdate.cid = uploadResult.public_id;

    const editedGroup = await Group.findOneAndUpdate(
      { _id: gid },
      { $set: fileldtoupdate },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      group: editedGroup,
      message: "group updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delgroup = async (req, res) => {
  try {
    const { gid } = req.validatedParams;

    const userid = req.user._id;

    const exists = await Group.findOne({
      admin: req.user._id,
      _id: gid,
    });

    if (exists?.institute?.trim() !== req.user.institute?.trim()) {
      return res.status(403).json({ error: "Not your college" });
    }
    if (exists.cid) {
      await cloudinary.uploader.destroy(exists.cid, { resource_type: "image" });
    }

    const del = await Group.findOneAndDelete({
      admin: userid,
      _id: gid,
    });

    if (!del) {
      return res.status(404).json({
        message: "group does not exist",
      });
    }

    res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getgroupPosts = async (req, res) => {
  try {
    const { gid } = req.validatedParams;

    const posts = await Post.find({ groupid: gid })
      .sort({ createdAt: -1 })
      .populate("creator", "name image");

    res.json({ posts });
  } catch (error) {
    console.error("Get group posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const ToggleGroup = async (req, res) => {
  try {
    const { gid } = req.validatedParams;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: gid }).populate(
      "admin",
      "name image",
    );
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (group.institute !== req.user.institute) {
      return res.status(403).json({ msg: "Invalid institute" });
    }

    const alreadyMember = group.members.some(
      (memberId) => memberId.toString() === userId.toString(),
    );

    if (alreadyMember) {
      group.members = group.members.filter(
        (memberId) => memberId.toString() !== userId.toString(),
      );
    } else {
      group.members.push(userId);
    }

    await group.save();

    res.json({
      message: alreadyMember ? "Left group" : "Joined group",
      success: true,
      updated: group,
    });
  } catch (error) {
    console.error("ToggleGroup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const AddGroupPost = async (req, res) => {
  try {
    const { gid, postid } = req.validatedParams;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: gid });
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (group.institute !== req.user.institute) {
      return res.status(403).json({ msg: "Invalid institute" });
    }

    const post = await Post.findOne({ _id: postid });
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.creator.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not your post" });
    }

    post.groupid = gid;
    await post.save();
    res.json({ message: "Post added to group", post });
  } catch (error) {
    console.error("AddGroupPost error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const RemoveGroupPost = async (req, res) => {
  try {
    const { gid, postid } = req.validatedParams;
    const userid = req.user._id;

    const group = await Group.findById(gid);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (group.institute !== req.user.institute) {
      return res.status(403).json({ msg: "Invalid institute" });
    }

    const user = await User.findOne({ _id: userid });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const post = await Post.findById(postid);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.creator?.toString() !== userid?.toString()) {
      return res.status(403).json({ msg: "Not your post" });
    }

    const alredyMember = user.groups.some(
      (g) => g?.toString() === gid?.toString(),
    );

    if (!alredyMember) {
      return res.status(404).json({ msg: "not joined group" });
    }
    if (user.cid) {
      await cloudinary.uploader.destroy(exists.cid, { resource_type: "image" });
    }
    await Post.findByIdAndDelete(postid);
    res.status(200).json({ message: "group post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllgroups = async (req, res) => {
  try {
    const { sort, searchValue } = req.ValidatedQuery;

    let sortOrder = sort === "desc" ? -1 : 1;
    const sortObj = { createdAt: sortOrder };

    const query = searchValue
      ? {
          $or: [
            { name: { $regex: searchValue, $options: "i" } },

            { institute: { $regex: searchValue, $options: "i" } },
          ],
        }
      : {};

      query.institute = req.user.institute;

    const groups = await Group.find(query).sort(sortObj).populate("admin", "name image");

    if (!groups) {
      return res.status(400).json({ msg: "groups not found" });
    }

    res.status(200).json({
      groups,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getadmingroups = async (req, res) => {
  try {
    const groups = await Group.find({
      admin: req.user._id,
    }).populate("admin", "name image");

    if (!groups) {
      return res.status(400).json({ msg: "groups not found" });
    }

    res.status(200).json({
      groups,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getGroupMemberCount = async (req, res) => {
  try {
    const { gid } = req.validatedParams;
    console.log(gid);
    if (!mongoose.isValidObjectId(gid)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const details = await Group.findOne({ _id: gid }).populate(
      "admin",
      "name image",
    );

    res.json({ grp: details });
  } catch (error) {
    console.error("Get member count error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
