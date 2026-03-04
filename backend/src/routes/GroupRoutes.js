import express from "express"
import { Authmiddleware } from "../middleware/AuthMiddleware.js"
import { BodyValidate, QueryValidate, validateParams } from "../middleware/validator.js"
import { getGroupQuery, groupparam, groupzodschema } from "../Validators/GroupZod.js"
import { getPagschema } from "../Validators/Commentzodschema.js"
import { AddGroupPost, createGroup, delgroup, EditGroup, getadmingroups, getAllgroups, getGroupMemberCount, getgroupPosts, getUsergroups, RemoveGroupPost, ToggleGroup } from "../controllers/GroupController.js"
import upload from "../middleware/upload.js"
const router = express.Router()

router.get("/admin",Authmiddleware,getadmingroups)
router.get("/user",Authmiddleware,getUsergroups)
router.get("/all",Authmiddleware,QueryValidate(getGroupQuery),getAllgroups)
router.get("/details/:gid",Authmiddleware,validateParams(groupparam),getGroupMemberCount)
router.get("/posts/:gid",Authmiddleware,validateParams(groupparam),getgroupPosts)
router.post("/create",Authmiddleware,upload.single("coverimage"),BodyValidate(groupzodschema),createGroup)
router.patch("/update/:gid",Authmiddleware,upload.single("coverimage"),validateParams(groupparam),BodyValidate(groupzodschema),EditGroup)
router.patch("/toggle/:gid",Authmiddleware,validateParams(groupparam),ToggleGroup)
router.patch("/add/:gid/post/:postid",Authmiddleware,validateParams(groupparam),AddGroupPost)
router.patch("/remove/:gid/post/:postid",Authmiddleware,validateParams(groupparam),RemoveGroupPost)
router.delete("/del/:gid",Authmiddleware,validateParams(groupparam),delgroup)


export default router;