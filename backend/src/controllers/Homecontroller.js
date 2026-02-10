import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const { l, s } = req.ValidatedQuery;

    const posts = await Post.find()
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

export const getDetailed = async (req, res) => {
  try {
    const { postid } = req.validatedParams;

    const post = await Post.findOne({
      _id: postid,
      creator:req.user._id
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
    })

     await newComment.populate('owner','name image');
    
    return res.status(201).json({ message: "new comment added",comment:newComment });
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

    await comment.populate("owner","name image")

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
    const exists = await Comment.find({_id:commentid})

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
      .populate("owner","name image");

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
