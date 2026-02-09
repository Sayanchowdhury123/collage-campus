import express from "express"
import { Authmiddleware } from "../middleware/AuthMiddleware.js"
import { BodyValidate, QueryValidate, validateParams } from "../middleware/validator.js"
import { getQueryschema } from "../Validators/postvalidationschema.js"
import { delcomment, Editcomment, getAllPosts, getComments, newComment } from "../controllers/Homecontroller.js"
import { addComment, commentparam, getPagschema } from "../Validators/Commentzodschema.js"

const router = express.Router()

router.get("/posts",Authmiddleware,QueryValidate(getPagschema),getAllPosts)
router.get("/all/comments",Authmiddleware,QueryValidate(getPagschema),validateParams(commentparam),getComments)
router.post("/add/:postid",Authmiddleware,validateParams(commentparam),BodyValidate(addComment),newComment)
router.patch("/update/:postid/c/:commentid",validateParams(commentparam),BodyValidate(addComment),Editcomment)
router.delete("/del/:postid/c/:commentid",validateParams(commentparam),delcomment)

export default router;

