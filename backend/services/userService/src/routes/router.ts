import { Router } from "express";
import v1UserRouter from './v1/userRouter'
import v1AdminRouter from './v1/adminRouter'

const router = Router();

router.use('/api/user-service/v1/admin', v1AdminRouter)
router.use('/api/user-service/v1/', v1UserRouter)

export default router