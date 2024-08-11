import { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import userApiAuth from "../../middlewares/userApiAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import createMeetingController from "../../controllers/createMeetingController";
import fetchMeetingsController from "../../controllers/fetchMeetingsController";

const router = Router();

router.post('/meeting', userApiAuth, tenantAuth, createMeetingController)
router.get('/meetings', userApiAuth, tenantAuth, fetchMeetingsController)

export default router
