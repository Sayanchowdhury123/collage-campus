import userSchema from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Verifymail } from "../config/verifyEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, collegeId, semester, batch, course } =
      req.validatedBody;

    const userExists = await userSchema.findOne({
      $or: [{ email }, { collegeId }],
    });

    if (userExists) {
      return res
        .status(400)
        .json("User with this email or college ID already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userSchema.create({
      name,
      email,
      password: hashedPassword,
      collegeId,
      semester,
      batch,
      course: course || "BCA",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    newUser.token = token;
    await newUser.save();
    Verifymail(token, email);

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json("token not found");
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(400).json({
            success: false,
            message: "The registration Token is Expired",
          });
        }

        return res.status(400).json({
          success: false,
          message: "Token verification failed, possibly expired",
        });
      } else {
        const { id } = decoded;
        const user = await userSchema.findById(id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        } else {
          user.token = null;
          user.isverifed = true;
          await user.save();
          return res.status(200).json({
            success: true,
            message: "Email verified successfully",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not access",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json("data is not valid");
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(400).json("no user found");
    }

    const checkpassword = bcrypt.compare(password, user.password);

    if (!checkpassword) {
      return res.status(400).json("password is wrong");
    }

    if (checkpassword && user.isverifed === true) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_SECRET,
        {
          expiresIn: "30days",
        },
      );

      await user.save();
      return res.status(200).json({
        id: user._id,
        accessToken: accessToken,
        name: user.name,
        email: user.email,
        image: user.image
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
