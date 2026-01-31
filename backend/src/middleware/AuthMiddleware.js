import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const Authmiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ error: "Authorization header missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json("Token missing");
    }

    let decode;
    try {
      decode = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      return res.status(401).json({
        error:
          err.name === "TokenExpiredError" ? "Token Expired" : "Invalid Token",
      });
    }

    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("auth middleware error", error);
    res.status(500).json({ error: "internal server error" });
  }
};