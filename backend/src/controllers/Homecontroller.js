import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const { searchValue, sort, page, limit } = req.ValidatedQuery;
    const skip = (page - 1) * limit;

    let sortOrder = sort === "desc" ? -1 : 1;
    const sortObj = { createdAt: sortOrder };

    const query = {};
    query.groupid = null;
    if (searchValue) query.content = { $regex: searchValue, $options: "i" };

    const posts = await Post.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("creator", "name image");

    const total = await Post.countDocuments(query);

    if (!posts) {
      return res.status(400).json({ msg: "posts not found" });
    }

    res.status(200).json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
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

export const getDetailed = async (req, res) => {
  try {
    const { postid } = req.validatedParams;

    const post = await Post.findOne({
      _id: postid,
      creator: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("creator", "name image institute");

    if (!post) {
      return res.status(400).json({ msg: "posts not found" });
    }

    res.status(200).json({
      post,
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

    await newComment.populate("owner", "name image");

    return res
      .status(201)
      .json({ message: "new comment added", comment: newComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const Editcomment = async (req, res) => {
  try {
    const { commentid } = req.validatedParams;
    const { message } = req.validatedBody;

    const fileldtoupdate = {};
    if (message !== undefined) fileldtoupdate.message = message;

    const comment = await Comment.findOneAndUpdate(
      { _id: commentid },
      { $set: fileldtoupdate },
      {
        new: true,
        runValidators: true,
      },
    );

    await comment.populate("owner", "name image");

    if (!comment) {
      return res.status(401).json({ message: "comment does not exist" });
    }

    return res.status(200).json({ message: "comment updayed", comment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delcomment = async (req, res) => {
  try {
    const { commentid } = req.validatedParams;
    const exists = await Comment.find({ _id: commentid });

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
    const { postid } = req.validatedParams;
    const comments = await Comment.find({
      post: postid,
    })
      .sort({ createdAt: -1 })
      .populate("owner", "name image");

    if (!comments) {
      return res.status(400).json({ msg: "Blogs not found" });
    }

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
