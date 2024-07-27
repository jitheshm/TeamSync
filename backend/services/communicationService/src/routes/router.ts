import { Router } from "express";
import v1UserRouter from './v1/userRouter'
const router = Router();

router.use('/api/communication-service/v1/', v1UserRouter)

export default router