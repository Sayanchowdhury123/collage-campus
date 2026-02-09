import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
   try {
    const { l, s } = req.ValidatedQuery;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("creator","name image");

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

export const newComment = async (req, res) => {
  try {
    const { postid } = req.validatedParams;
    const { message } = req.validatedBody;

    const newComment = await Comment.create({
      owner: req.user._id,
      message,
      post: postid,
    });

    return res.status(201).json({ message: "new comment added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const Editcomment = async (req, res) => {
  try {
    const { postid, commentid } = req.validatedParams;
    const { message } = req.validatedBody;

    const exists = await Comment.findOne({
      owner: req.user._id,
      post: postid,
    });

    if (!exists) {
      return res.status(401).json({ message: "comment does not exist" });
    }

    const fileldtoupdate = {};
    if (message !== undefined) fileldtoupdate.message = message;

    const editpost = await Comment.findOneAndUpdate(
      { _id: commentid },
      { $set: fileldtoupdate },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({ message: "comment updayed", post: editpost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delcomment = async (req, res) => {
  try {
    const { postid, commentid } = req.validatedParams;
    const exists = await Comment.findOne({
      owner: req.user._id,
      post: postid,
    });

    if (!exists) {
      return res.status(401).json({ message: "comment does not exist" });
    }

    await Comment.findByIdAndDelete(commentid);

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { l, s } = req.ValidatedQuery;
    const {postid} = req.validatedParams;
    const comments = await Comment.find({
      post:postid
    })
      .sort({ createdAt: -1 })
      .populate("owner");

    if (!comments) {
      return res.status(400).json({ msg: "Blogs not found" });
    }

    const pag = comments.slice(s, l + s);

    res.status(200).json({
      comments: pag,
      h: s + l < comments.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
