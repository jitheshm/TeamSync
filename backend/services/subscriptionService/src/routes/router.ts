import { Router } from "express";
import v1AdminRouter from './v1/adminRouter'
const router = Router();

router.use('/api/subscription-service/v1/admin/',v1AdminRouter)

export default router