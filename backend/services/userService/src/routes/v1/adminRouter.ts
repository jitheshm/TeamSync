import { Router } from "express";
import fetchUsersController from "../../controllers/v1/fetchUsersController";
import adminAuth from "../../middlewares/adminAuth";



const router = Router();

router.get('/users', adminAuth, fetchUsersController)

export default router