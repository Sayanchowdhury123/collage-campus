import express from "express";
import { BodyValidate, validateParams } from "../middleware/validator.js";
import { editProfileZodschema, userIdParamSchema } from "../Validators/profileValidator.js";
import { EditProfile, getprofile } from "../controllers/profileController.js";
import { Authmiddleware } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/upload.js";
import { parseProfileNumbers } from "../middleware/parseNumber.js";

const router = express.Router()

router.get("/get/:id",Authmiddleware,getprofile)
router.patch("/edit/:id",Authmiddleware,upload.single("image"),parseProfileNumbers,BodyValidate(editProfileZodschema),EditProfile)


export default router;