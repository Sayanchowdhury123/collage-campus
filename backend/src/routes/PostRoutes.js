import express from "express"
import { addPost, delpost, editPost, getAllPosts, getUserPosts } from "../controllers/Postcontroller.js"
import { BodyValidate, QueryValidate, validateParams } from "../middleware/validator.js";
import { createPostSchema, getQueryschema, postidschema, updatePostSchema } from "../Validators/postvalidationschema.js";

import { Authmiddleware } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router()


router.get("/getAll",Authmiddleware,QueryValidate(getQueryschema),getAllPosts)
router.get("/posts",Authmiddleware,QueryValidate(getQueryschema),getUserPosts)
router.post("/add",Authmiddleware,upload.single("cover"),BodyValidate(createPostSchema),addPost)
router.patch("/update/:postid",Authmiddleware,upload.single("cover"),validateParams(postidschema),BodyValidate(updatePostSchema),editPost)
router.delete("/del/:postid",Authmiddleware,validateParams(postidschema),delpost)



export default router;