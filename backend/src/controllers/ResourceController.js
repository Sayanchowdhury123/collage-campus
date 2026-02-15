import Resource from "../models/Resource.js";

import { uploadResourceToCloudinary } from "../config/cloudinary.js";

const getResourceType = (fileType) => {
  if (fileType === "pdf") return "raw";
  if (fileType === "ppt" || fileType === "doc") return "raw";
  if (fileType === "txt") return "raw";
  return "image";
};

export const createResource = async (req, res) => {
  try {
    const { title, description, subject, semester, course } = req.validatedBody;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileTypeMap = {
      "application/pdf": "pdf",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "ppt",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "doc",
      "text/plain": "txt",
      "image/png": "image",
      "image/jpeg": "image",
    };

    const fileType = fileTypeMap[req.file.mimetype];
    if (!fileType) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const folder = `${req.user.institute}/${course}/sem${semester}`;
    const uploadResult = await uploadResourceToCloudinary(
      req.file.buffer,
      folder,
    );

    const resource = await Resource.create({
      title,
      description,
      subject,
      semester: parseInt(semester),
      course,
      fileType,
      fileSize: req.file.size,
      fileUrl: uploadResult.secure_url,
      fileId: uploadResult.public_id,
      uploader: req.user._id,
      institute: req.user.institute,
    });

    res
      .status(201)
      .json({ resource, message: "Resource uploaded successfully" });
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({ message: "Failed to upload resource" });
  }
};

export const downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.validatedParams;

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { downloads: 1 } },
      { new: true },
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.redirect(resource.fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Download failed" });
  }
};

export const upvoteResource = async (req, res) => {
  try {
    const { resourceId } = req.validatedParams;
    const userId = req.user._id;

    const resource = await Resource.findById(resourceId);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    const alreadyUpvoted = resource.upvotes.some(
      (vote) => vote.user.toString() === userId.toString(),
    );

    if (alreadyUpvoted) {
      await Resource.findByIdAndUpdate(resourceId, {
        $pull: { upvotes: { user: userId } },
      });
    } else {
      await Resource.findByIdAndUpdate(resourceId, {
        $addToSet: { upvotes: { user: userId } },
      });
    }

    const updatedResource = await Resource.findById(resourceId);
    res.json({
      upvotes: updatedResource.upvotes.length,
      isUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    res.status(500).json({ message: "Upvote failed" });
  }
};

export const getResources = async (req, res) => {
  try {
    const { subject, semester, course, page, limit } = req.ValidatedQuery;
    const skip = (page - 1) * limit;

    const query = { institute: req.user.institute };
    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (semester) query.semester = semester;
    if (course) query.course = { $regex: course, $options: "i" };

    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("uploader", "name avatar")
      .populate("groupId", "name");

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { resourceid } = req.validatedParams;
    const userid = req.user._id;

    if (exists.fileId) {
      await cloudinary.uploader.destroy(exists.fileId, {
        resource_type: "image",
      });
    }

    const del = await Resource.findOneAndDelete({
      uploader: userid,
      _id: resourceid,
      institute: req.user.institute,
    });

    if (!del) {
      return res.status(404).json({
        message: "Already Deleted or Resource does not exist",
      });
    }

    if (del.fileId) {
      const resourceType = getResourceType(del.fileType);
      await cloudinary.uploader.destroy(del.fileId, {
        resource_type: resourceType,
      });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Deletion failed" });
  }
};

export const editResource = async (req, res) => {
  try {
    const { title, description, subject, semester, course } = req.validatedBody;
    const { resourceid } = req.validatedParams;

    const exists = await Resource.findOne({
      uploader: req.user._id,
      _id: resourceid,
    });

    if (!exists) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let uploadResult;
    if (req.file) {
      try {
        if (exists.fileId) {
          const resourcetype = getResourceType(exists.fileType);
          await cloudinary.uploader.destroy(exists.fileId, {
            resource_type: resourcetype,
          });
        }
        uploadResult = await uploadResourceToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ msg: "image upload error" });
      }
    }

    const fileldtoupdate = {};
    if (title !== undefined) fileldtoupdate.title = title;
    if (description !== undefined) fileldtoupdate.description = description;
    if (semester !== undefined) fileldtoupdate.semester = semester;
    if (course !== undefined) fileldtoupdate.course = course;
    if (subject !== undefined) fileldtoupdate.subject = subject;
    if (uploadResult?.secure_url !== undefined)
      fileldtoupdate.fileUrl = uploadResult.secure_url;
    if (uploadResult?.public_id !== undefined)
      fileldtoupdate.fileId = uploadResult.public_id;

    const resource = await Resource.findOneAndUpdate(
      { _id: resourceid },
      { $set: fileldtoupdate },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      data: resource,
      message: "resource updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
