import { NextFunction, Request, Response, Router } from "express";
import { checkSchema } from "express-validator";
import adminLoginValidator from "../../validators/adminLoginValidator";
import adminAuth from "../../middlewares/adminAuth";
import admintokenVerifyController from "../../controllers/v1/admintokenVerifyController";
import IAdminController from "../../controllers/v1/interfaces/IAdminController";
import { container } from "../../config/inversify/inversify";
import formValidation from "../../middlewares/formValidation";


const router = Router()

const adminController = container.get<IAdminController>("IAdminController");


router.post('/login', checkSchema(adminLoginValidator()), formValidation,
    (req: Request, res: Response, next: NextFunction) => adminController.login(req, res, next))

router.get('/token/verify', adminAuth, admintokenVerifyController)
router.post('/token/new', 
    (req:Request,res:Response,next:NextFunction)=>adminController.newToken(req,res,next));



export default router