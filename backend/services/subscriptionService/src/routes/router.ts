import { Router } from "express";
import v1AdminRouter from './v1/adminRouter'
import v1UserRouter from './v1/userRouter'
const router = Router();

router.use('/api/subscription-service/v1/admin/',v1AdminRouter)
router.use('/api/subscription-service/v1/',v1UserRouter)

export default router