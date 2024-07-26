import { Router } from "express";
import fetchUsersController from "../../controllers/v1/fetchUsersController";
import adminAuth from "../../middlewares/adminAuth";
import blockUserController from "../../controllers/v1/blockUserController";
import unBlockUserController from "../../controllers/v1/unBlockUserController";
import deleteUsersController from "../../controllers/v1/deleteUsersController";
import fetchSpecificUserController from "../../controllers/v1/fetchSpecificUserController";
import registerUserController from "../../controllers/v1/registerUserController";
import fetchUsersCount from "../../controllers/v1/fetchUsersCount";



const router = Router();

router.get('/users', adminAuth, fetchUsersController)
router.get('/users/stats', adminAuth, fetchUsersCount)
router.post('/users', adminAuth, registerUserController)
router.patch('/users/block/:userId', adminAuth, blockUserController)
router.patch('/users/unblock/:userId', adminAuth, unBlockUserController)
router.delete('/users/:userId', adminAuth, deleteUsersController)
router.get('/users/:userId', adminAuth, fetchSpecificUserController)

export default router