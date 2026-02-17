import Resource from "../models/Resource.js";
import { supabase } from "../utils/supabase.js";
import cloudinary, {
  uploadResourceToCloudinary,
} from "../config/cloudinary.js";

const getResourceType = (mimetype) => {
  const mimeMap = {
    "application/pdf": "pdf",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "text/plain": "txt",
  };
  return mimeMap[mimetype] || "raw";
};

export const createResource = async (req, res) => {
  try {
    const { title, description, subject, semester, course } = req.validatedBody;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const mimeToExt = {
      "application/pdf": "pdf",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "pptx",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "text/plain": "txt",
    };
    const ext = mimeToExt[req.file.mimetype] || "bin";
    const filename = `${Date.now()}_${req.user._id}.${ext}`;
    const folder = `${req.user.institute}/${course}/sem${semester}`;
    const filePath = `${folder}/${filename}`;
  

    const { data, error } = await supabase.storage
      .from("resources")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ message: "Upload failed" });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("resources").getPublicUrl(filePath);

    const resource = await Resource.create({
      title,
      description,
      subject,
      semester: parseInt(semester),
      course,
      fileType: ext,
      fileId:filePath,
      fileSize: req.file.size,
      fileUrl: publicUrl,
      uploader: req.user._id,
      institute: req.user.institute,
    });

    res.status(201).json({ resource, message: "Resource uploaded" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const downloadResource = async (req, res) => {
  try {
    const { resourceid } = req.params;
    const resource = await Resource.findById(resourceid);

    if (!resource) return res.status(404).json({ message: "Not found" });

    await Resource.findByIdAndUpdate(resourceid, { $inc: { downloads: 1 } });

    res.json({ fileUrl: resource.fileUrl });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Download failed" });
  }
};

export const upvoteResource = async (req, res) => {
  try {
    const { resourceid } = req.validatedParams;
    const userId = req.user._id;

    const resource = await Resource.findById(resourceid);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    const alreadyUpvoted = resource.upvotes.some(
      (vote) => vote.user.toString() === userId.toString(),
    );

    if (alreadyUpvoted) {
      await Resource.findByIdAndUpdate(resourceid, {
        $pull: { upvotes: { user: userId } },
      });
    } else {
      await Resource.findByIdAndUpdate(resourceid, {
        $addToSet: { upvotes: { user: userId } },
      });
    }

    await resource.populate("uploader", "name image");

    res.status(200).json({
      upvotes: resource,
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

export const getUserResources = async (req, res) => {
  try {
    const query = { institute: req.user.institute, uploader: req.user._id };

    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .populate("uploader", "name avatar")
      .populate("groupId", "name");

    res.json({
      resources,
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
  
    console.log(del.fileId)
    if (del.fileId) {
      const oldPath = del.fileId;
      const { error: deleteError } = await supabase.storage
        .from("resources")
        .remove([oldPath]);

      if (deleteError) {
        console.warn("Failed to delete old file:", deleteError.message);
      }
    }



    res.status(204).end();
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Deletion failed" });
  }
};

export const editResource = async (req, res) => {
  try {
    const { resourceid } = req.params;
    const { title, description, subject, semester, course } = req.validatedBody;

    const exists = await Resource.findOne({
      uploader: req.user._id,
      _id: resourceid,
    });

    if (!exists) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const fieldsToUpdate = {};
    if (title !== undefined) fieldsToUpdate.title = title;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (semester !== undefined) fieldsToUpdate.semester = semester;
    if (course !== undefined) fieldsToUpdate.course = course;
    if (subject !== undefined) fieldsToUpdate.subject = subject;

    if (req.file) {
      const folder = `${req.user.institute}/${course}/sem${semester}`;
      const ext = getResourceType(req.file.mimetype);
      const filename = `${Date.now()}_${req.user._id}.${ext}`;
      const filePath = `${folder}/${filename}`;
     
      try {
        if (exists.fileId) {
          
          const { error: deleteError } = await supabase.storage
            .from("resources")
            .remove([exists.fileId]);

          if (deleteError) {
            console.warn("Failed to delete old file:", deleteError.message);
          }
        }

        const { data, error: uploadError } = await supabase.storage
          .from("resources")
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          return res.status(500).json({ message: "File upload failed" });
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("resources").getPublicUrl(filePath);

        fieldsToUpdate.fileUrl = publicUrl;
        fieldsToUpdate.fileId = filePath;
        fieldsToUpdate.fileType = ext;
      } catch (error) {
        console.error("File processing error:", error);
        return res.status(500).json({ message: "File processing failed" });
      }
    }

    const updatedResource = await Resource.findOneAndUpdate(
      { _id: resourceid },
      { $set: fieldsToUpdate },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      data: updatedResource,
      message: "Resource updated successfully",
    });
  } catch (error) {
    console.error("Edit resource error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const ResourceDetails = async (req, res) => {
  try {
    const { resourceid } = req.validatedParams;

    const data = await Resource.findOne({
      _id: resourceid,
      uploader: req.user._id,
    }).populate("uploader", "name image");

    if (!data) {
      return res.status(404).json({ msg: "data not found" });
    }

    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
