import { Router } from "express";
import v1UserRouter from './v1/userRouter'
const router = Router();

router.use('/api/tenant-service/v1/',v1UserRouter)

export default router