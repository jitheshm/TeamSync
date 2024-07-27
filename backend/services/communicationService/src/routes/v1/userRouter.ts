import { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import userApiAuth from "../../middlewares/userApiAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import createMeetingController from "../../controllers/createMeetingController";

const router = Router();

router.post('/meeting', userApiAuth, tenantAuth, createMeetingController)

export default router
