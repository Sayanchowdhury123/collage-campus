import express from "express"
import { Authmiddleware } from "../middleware/AuthMiddleware.js";
import { BodyValidate, QueryValidate, validateParams } from "../middleware/validator.js";
import { createResourceSchema, getResourceQuery, ResourceParam, updateResourceSchema } from "../Validators/ResourceZod.js";
import { createResource, deleteResource, downloadResource, editResource, getResources, upvoteResource } from "../controllers/ResourceController.js";
import { uploadResource } from "../middleware/upload.js";
import { parseAddResourceNumbers } from "../middleware/parseNumber.js";

const router = express.Router()


router.get("/get",Authmiddleware,QueryValidate(getResourceQuery),getResources)
router.get("/download/:resourceid",Authmiddleware,validateParams(ResourceParam),downloadResource)
router.post("/upload",Authmiddleware,uploadResource,parseAddResourceNumbers,BodyValidate(createResourceSchema),createResource)
router.patch("/vote/:resourceid",Authmiddleware,validateParams(ResourceParam),upvoteResource)
router.patch("/update/:resourceid",Authmiddleware,upvoteResource,parseAddResourceNumbers,BodyValidate(updateResourceSchema),validateParams(ResourceParam),editResource)
router.delete("/delete",Authmiddleware,validateParams(ResourceParam),deleteResource)


export default router;