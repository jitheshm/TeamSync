import { NextFunction, Request, Response, Router } from "express";
import { checkSchema } from "express-validator";
import adminLoginValidator from "../../validators/adminLoginValidator";
import IAdminController from "../../controllers/v1/interfaces/IAdminController";
import { container } from "../../config/inversify/inversify";
import formValidation from "../../middlewares/formValidation";


const router = Router()

const adminController = container.get<IAdminController>("IAdminController");


router.post('/login', checkSchema(adminLoginValidator()), formValidation,
    (req: Request, res: Response, next: NextFunction) => adminController.login(req, res, next))

router.post('/token/new', 
    (req:Request,res:Response,next:NextFunction)=>adminController.newToken(req,res,next));



export default router