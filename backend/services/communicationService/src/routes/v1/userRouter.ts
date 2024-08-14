import { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import userApiAuth from "../../middlewares/userApiAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import fetchMeetingsController from "../../controllers/fetchMeetingsController";
import { container } from "../../config/inversify/inversify";
import { IMeetingController } from "../../controllers/interfaces/IMeetingController";

const router = Router();

const meetingController = container.get<IMeetingController>("IMeetingController");

router.post('/meeting', userApiAuth, tenantAuth,
    (req, res, next) => meetingController.createMeeting(req, res, next));

router.get('/meetings', userApiAuth, tenantAuth, fetchMeetingsController)

export default router
