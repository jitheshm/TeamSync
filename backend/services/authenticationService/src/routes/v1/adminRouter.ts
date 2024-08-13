import { NextFunction,Request,Response, Router } from "express";
import { checkSchema } from "express-validator";
import adminLoginValidator from "../../validators/adminLoginValidator";
import adminAuth from "../../middlewares/adminAuth";
import admintokenVerifyController from "../../controllers/v1/admintokenVerifyController";
import adminNewTokenController from "../../controllers/v1/adminNewTokenController";
import IAdminController from "../../controllers/v1/interfaces/IAdminController";
import { container } from "../../config/inversify/inversify";


const router = Router()

const adminController = container.get<IAdminController>("IAdminController");


router.post('/login', checkSchema(adminLoginValidator()), (req:Request, res:Response, next:NextFunction) => adminController.login(req, res, next))
router.get('/token/verify', adminAuth, admintokenVerifyController)
router.post('/token/new', adminNewTokenController);



export default router