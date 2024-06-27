import { Router } from "express";
import fetchUsersController from "../../controllers/v1/fetchUsersController";
import adminAuth from "../../middlewares/adminAuth";
import blockUserController from "../../controllers/v1/blockUserController";
import unBlockUserController from "../../controllers/v1/unBlockUserController";



const router = Router();

router.get('/users', adminAuth, fetchUsersController)
router.patch('/users/block/:userId', adminAuth, blockUserController)
router.patch('/users/unblock/:userId', adminAuth, unBlockUserController)
router.delete('/users/:userId', adminAuth, fetchUsersController)
router.get('/users/:userId', adminAuth, fetchUsersController)

export default router