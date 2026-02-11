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

    const newGroup = await Group.create({
      name,
      description,
      admin: userid,
      coverimage: uploadResult.secure_url,
      cid: uploadResult.public_id,
      institute: req.user.institute,
    });

    res.status(201).json({
      Group: newGroup,
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
      data: editedGroup,
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

    if (exists.institute !== req.user.institute) {
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
    const { l, s } = req.ValidatedQuery;
    const { gid } = req.validatedParams;
    const posts = await Post.find({
      groupid: gid,
    })
      .sort({ createdAt: -1 })
      .populate("creator", "name image");

    if (!posts) {
      return res.status(400).json({ msg: "posts not found" });
    }

    const pag = posts.slice(s, l + s);

    res.status(200).json({
      posts: pag,
      h: s + l < posts.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const ToggleGroup = async (req, res) => {
  try {
    const { gid } = req.validatedParams;
    const userId = req.user._id;

    const group = await Group.findById(gid);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (group.institute !== req.user.institute) {
      return res.status(403).json({ msg: "Invalid institute" });
    }

    const user = await User.findById(userId);
    const alreadyMember = user.groups.some(
      (g) => g.toString() === gid.toString(),
    );

    if (alreadyMember) {
      user.groups = user.groups.filter((g) => g.toString() !== gid.toString());
    } else {
      user.groups.push(gid);
    }

    await user.save();
    res.json({ message: alreadyMember ? "Left group" : "Joined group" });
  } catch (error) {
    console.error("ToggleGroup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const AddGroupPost = async (req, res) => {
  try {
    const { gid, postid } = req.validatedParams;
    const userId = req.user._id;

    const group = await Group.findById(gid);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (group.institute !== req.user.institute) {
      return res.status(403).json({ msg: "Invalid institute" });
    }

    const post = await Post.findById(postid);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.creator.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not your post" });
    }

    post.groupid = gid;
    await post.save();
    res.json({ message: "Post added to group" });
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
    if (post.creator.toString() !== userid.toString()) {
      return res.status(403).json({ msg: "Not your post" });
    }

    const alredyMember = user.groups.some((g) => g === gid);

    if (!alredyMember) {
      return res.status(404).json({ msg: "not joined group" });
    }


    post.groupid = "";
    await post.save();
    res.status(200).json({ message: "group post removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getusergroups = async (req, res) => {
  try {
    const { l, s } = req.ValidatedQuery;
    const { gid } = req.validatedParams;

    const groups = await User.find({
      groupid: gid,
    })
      .sort({ createdAt: -1 })
      .populate("groups", "name coverimage description");

    if (!groups) {
      return res.status(400).json({ msg: "groups not found" });
    }

    const pag = groups.slice(s, l + s);

    res.status(200).json({
      groups: pag,
      h: s + l < groups.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
