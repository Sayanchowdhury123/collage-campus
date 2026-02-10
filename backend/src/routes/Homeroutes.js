import express from "express"
import { Authmiddleware } from "../middleware/AuthMiddleware.js"
import { BodyValidate, QueryValidate, validateParams } from "../middleware/validator.js"
import { getQueryschema } from "../Validators/postvalidationschema.js"
import { delcomment, Editcomment, getAllPosts, getComments, getDetailed, newComment } from "../controllers/Homecontroller.js"
import { addComment, commentparam, getPagschema } from "../Validators/Commentzodschema.js"

const router = express.Router()

router.get("/posts",Authmiddleware,QueryValidate(getPagschema),getAllPosts)
router.get("/detailed/:postid",Authmiddleware,validateParams(commentparam),getDetailed)
router.get("/comments/:postid",Authmiddleware,validateParams(commentparam),getComments)
router.post("/add/:postid",Authmiddleware,validateParams(commentparam),BodyValidate(addComment),newComment)
router.patch("/update/:commentid",Authmiddleware,validateParams(commentparam),BodyValidate(addComment),Editcomment)
router.delete("/del/:commentid",Authmiddleware,validateParams(commentparam),delcomment)

export default router;

