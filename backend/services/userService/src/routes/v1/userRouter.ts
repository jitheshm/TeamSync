import { Router } from "express";
import signupController from "../../controllers/v1/signupController";
import { checkSchema } from "express-validator";
import signupValidator from "../../validators/signupValidator";


const router = Router();

router.post('/register', checkSchema(signupValidator()), signupController)

export default router