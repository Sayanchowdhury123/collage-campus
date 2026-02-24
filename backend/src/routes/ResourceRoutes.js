import express from "express"
import { Authmiddleware } from "../middleware/AuthMiddleware.js";
import { BodyValidate, QueryValidate, validateParams } from "../middleware/validator.js";
import { createResourceSchema, getNotificationQuery, getResourceQuery, ResourceParam, updateResourceSchema } from "../Validators/ResourceZod.js";
import { createResource, deleteResource, downloadResource, editResource, getNotifications, getResources, getUserResources, ResourceDetails, unique, upvoteResource } from "../controllers/ResourceController.js";
import { uploadResource } from "../middleware/upload.js";
import { parseAddResourceNumbers } from "../middleware/parseNumber.js";

const router = express.Router()


router.get("/get",Authmiddleware,QueryValidate(getNotificationQuery),getResources)
router.get("/notifications",Authmiddleware,QueryValidate(getResourceQuery),getNotifications)
router.get("/unique",Authmiddleware,unique)
router.get("/uploader",Authmiddleware,getUserResources)
router.get("/details/:resourceid",Authmiddleware,validateParams(ResourceParam),ResourceDetails)
router.get("/download/:resourceid",Authmiddleware,validateParams(ResourceParam),downloadResource)
router.post("/upload",Authmiddleware,uploadResource,parseAddResourceNumbers,BodyValidate(createResourceSchema),createResource)
router.patch("/vote/:resourceid",Authmiddleware,validateParams(ResourceParam),upvoteResource)
router.put("/edit/:resourceid",Authmiddleware,uploadResource,parseAddResourceNumbers,BodyValidate(updateResourceSchema),validateParams(ResourceParam),editResource)
router.delete("/delete/:resourceid",Authmiddleware,validateParams(ResourceParam),deleteResource)


export default router;