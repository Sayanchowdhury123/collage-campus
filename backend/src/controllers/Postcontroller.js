import Post from "../models/Post.js";
import { CoverUplaodToCloudinary } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const addPost = async (req, res) => {
  try {
    const { content } = req.validatedBody;

    const userid = req.user._id;
    let uploadResult = await CoverUplaodToCloudinary(req.file.buffer);

    const newPost = await Post.create({
      content,
      institute: req.user.institute,
      creator: userid,
      cover: uploadResult.secure_url,
      cid: uploadResult.public_id,
    });

    res.status(201).json({
      post: newPost,
      message: "post created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const { content } = req.validatedBody;
    const { postid } = req.validatedParams;

    const exists = await Post.findOne({
      creator: req.user._id,
      _id: postid,
    });

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
        uploadResult = await CoverUplaodToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ msg: "image upload error" });
      }
    }

    const fileldtoupdate = {};
    if (content !== undefined) fileldtoupdate.content = content;
    if (uploadResult?.secure_url !== undefined)
      fileldtoupdate.cover = uploadResult.secure_url;
    if (uploadResult?.public_id !== undefined)
      fileldtoupdate.cid = uploadResult.public_id;

    const editpost = await Post.findOneAndUpdate(
      { _id: postid },
      { $set: fileldtoupdate },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      post: editpost,
      message: "post updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delpost = async (req, res) => {
  try {
    const { postid } = req.validatedParams;

    const userid = req.user._id;

    const exists = await Post.findOne({
      creator: req.user._id,
      _id: postid,
    });

    if (exists.cid) {
      await cloudinary.uploader.destroy(exists.cid, { resource_type: "image" });
    }

    const del = await Post.findOneAndDelete({
      user: userid,
      _id: postid,
    });

    if (!del) {
      return res.status(404).json({
        message: "post does not exist",
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

export const getAllPosts = async (req, res) => {
  try {
    const { limit, page } = req.ValidatedQuery;
    const total = await Post.countDocuments({});
    const query = { institute: req.user.institute };

    const allPosts = await Post.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    if (allPosts.length === 0) {
      return res.status(200).json({
        message: "no data",
        data: [],
      });
    }

    res.status(200).json({
      message: "posts fetched",
      data: allPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { limit, page } = req.ValidatedQuery;
    const total = await Post.countDocuments({});
    const query = {creator: req.user._id};

    const allPosts = await Post.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    if (allPosts.length === 0) {
      return res.status(200).json({
        message: "no data",
        data: [],
      });
    }

    res.status(200).json({
      message: "user posts fetched",
      data: allPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
