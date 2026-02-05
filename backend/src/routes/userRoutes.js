import express from "express"
import { BodyValidate } from "../middleware/validator.js";
import { backendRegisterZodSchema, LoginZodschema, RegisterZodschema } from "../Validators/authValidation.js";
import { login, register, verifyToken } from "../controllers/authController.js";

const router = express.Router()

router.get("/verify",verifyToken)
router.post("/register",BodyValidate(backendRegisterZodSchema),register)
router.post("/login",BodyValidate(LoginZodschema),login)

export default router;